const PDFDocument = require("pdfkit");
const fs = require("fs");

function generatePDF(invoice, path) {
  // TODO: implement generatePDF function
  let doc = new PDFDocument({ size: "A4", margin: 50});
  doc.pipe(fs.createWriteStream(path));

  generateHeader(doc, invoice);
  generateCustomerInfo(doc, invoice);
  // generateInvoiceTable(doc, invoice);
  generateFooter(doc, invoice);
  doc.end();

}

function generateHeader(doc, invoice) {
  let send = invoice.sender
  doc
    .fontSize(20)
    .text(send.name, 110, 57)
    .fontSize(10)
    .text(send.name, 200, 50, { align: "right" })
    .text(send.address, 200, 65, { align: "right" })
    .text(`${send.city}, ${send.state}, ${send.postal_code}`, 200, 80, { align: "right" })
    .moveDown();
}


function generateCustomerInfo(doc, invoice) {
  doc
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHomeRow(doc, 185);

  const position = 200; //Y-coordinate position
  let ship = invoice.shipping

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
  .text(
    `${ship.city}, ${ship.state}, ${ship.country}`,
    300,
    position + 30
  )
  .text(ship.email, 300, position + 45)
  .moveDown();

  generateHomeRow(doc, 267);

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
    .text(
      invoice.notes,
      50,
      780,
      { align: "center", width: 500 }
    );
}

module.exports = { generatePDF };


