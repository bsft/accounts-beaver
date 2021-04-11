const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateInvoiceFromRequestObject(body) {
  const shipping = {
    name: body["recipient-name"],
    address: body["recipient-address"],
    city: body["recipient-city"],
    state: body["recipient-state"],
    country: body["recipient-country"],
    postal_code: body["recipient-zip"],
    email: body["recipient-email"],
  };
  const sender = {
    name: body["sender-name"],
    address: body["sender-address"],
    city: body["sender-city"],
    state: body["sender-state"],
    country: body["sender-country"],
    postal_code: body["sender-zip"],
    email: body["sender-email"],
  };
  const items = [];
  const seen_items = new Set();
  for (const key of Object.keys(body)) {
    if (key.startsWith("item")) {
      const itemNum = key.slice(0, key.indexOf("-"));
      if (!seen_items.has(itemNum)) {
        seen_items.add(itemNum);
        items.push({
          item_description: body[`${itemNum}-description`],
          quantity: body[`${itemNum}-quantity`],
          amount: body[`${itemNum}-amount`],
        });
      }
    }
  }
  const due = new Date(body["due-date"]);

  return generateInvoice(
    body["invoice-num"],
    shipping,
    sender,
    items,
    due,
    body["shipping-costs"],
    body["notes"],
    body["amount-paid"],
    body["terms"],
    body["tax"]
  );
}

function generateInvoice(
  invoice_nb,
  shipping,
  sender,
  items,
  due,
  shipping_costs,
  notes,
  amount_paid = 0,
  terms = "Net 30",
  tax = 8
) {
  // calculate subtotal
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal = subtotal + items[i].amount * items[i].quantity;
  }

  return {
    invoice_nb,
    due, // Date object
    terms, // "PIA" || "CIA" || "Upon Receipt" || "Net X" || "EOM" || "X MFI" || "X Percent Upfront"
    shipping,
    // shipping === {
    //   name: "John Doe",
    //   address: "1234 Main Street",
    //   city: "San Francisco",
    //   state: "CA",
    //   country: "US",
    //   postal_code: 12345,
    //   email: "john@doe.com",
    // }
    sender,
    // sender === {
    //   name: "Accounts Beaver",
    //   address: "1500 SW Jefferson Way",
    //   city: "Corvallis",
    //   state: "OR",
    //   country: "US",
    //   postal_code: 97331,
    // }
    items,
    // items === [
    //   {
    //     item_description: "Toner Cartridge",
    //     quantity: 2,
    //     amount: 6000,
    //   }, ...
    // ]
    subtotal, // in cents
    shipping_costs, // in cents
    amount_paid, // in cents
    tax, // percent
    notes,
  };
}

function savePdfToFile(pdf, fileName) {
  return new Promise((resolve, reject) => {
    // To determine when the PDF has finished being written successfully
    // we need to confirm the following 2 conditions:
    //
    //   1. The write stream has been closed
    //   2. PDFDocument.end() was called syncronously without an error being thrown

    let pendingStepCount = 2;

    const stepFinished = () => {
      if (--pendingStepCount == 0) {
        resolve();
      }
    };

    const writeStream = fs.createWriteStream(fileName);
    writeStream.on("close", stepFinished);
    pdf.pipe(writeStream);

    pdf.end();

    stepFinished();
  });
}

function generatePDF(invoice, path) {
  let doc = new PDFDocument({ size: "Letter", margin: 50 });

  generateHeader(doc, invoice);
  generateCustomerInfo(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc, invoice);
  return savePdfToFile(doc, path);
}

function generateHeader(doc, invoice) {
  let send = invoice.sender;
  doc
    .fontSize(20)
    .text(send.name, 110, 57)
    .fontSize(10)
    .text(send.name, 200, 50, { align: "right" })
    .text(send.address, 200, 65, { align: "right" })
    .text(`${send.city}, ${send.state}, ${send.postal_code}`, 200, 80, {
      align: "right",
    })
    .moveDown();
}

function generateCustomerInfo(doc, invoice) {
  doc.fontSize(20).text("Invoice", 50, 160);

  generateHomeRow(doc, 185);

  const position = 200; //Y-coordinate position
  let ship = invoice.shipping;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, position)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nb, 150, position)
    .font("Helvetica")
    .text("Invoice Date:", 50, position + 15)
    .text(formatDate(new Date()), 150, position + 15)
    .text("Balance Due:", 50, position + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.amount_paid),
      150,
      position + 30
    )
    .text("Terms:", 50, position + 45)
    .text(invoice.terms, 150, position + 45)

    .font("Helvetica-Bold")
    .text(ship.name, 300, position)
    .font("Helvetica")
    .text(ship.address, 300, position + 15)
    .text(`${ship.city}, ${ship.state}, ${ship.country}`, 300, position + 30)
    .text(ship.email, 300, position + 45)
    .moveDown();

  generateHomeRow(doc, 267);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const tableTop = 345; //represents the top of the invoice table

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    tableTop,
    "Item Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHomeRow(doc, tableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = tableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item_description,
      formatCurrency(item.amount),
      item.quantity,
      formatCurrency(item.amount * item.quantity)
    );

    generateHomeRow(doc, position + 20);
  }

  const subtotalPosition = tableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    formatCurrency(invoice.amount_paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    formatCurrency(invoice.subtotal - invoice.amount_paid)
  );
  doc.font("Helvetica");
}

function generateHomeRow(doc, y_pos) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y_pos)
    .lineTo(550, y_pos)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return month + "/" + day + "/" + year;
}

function generateTableRow(
  doc,
  y_pos,
  item_description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item_description, 50, y_pos)
    .text(unitCost, 280, y_pos, { width: 90, align: "right" })
    .text(quantity, 370, y_pos, { width: 90, align: "right" })
    .text(lineTotal, 0, y_pos, { align: "right" });
}

function generateFooter(doc, invoice) {
  doc
    .fontSize(10)
    .text(invoice.notes, 50, 700, { align: "center", width: 500 });
}

module.exports = { generateInvoiceFromRequestObject, generatePDF };
