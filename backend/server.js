const PORT = 3000;
const express = require("express");
const Busboy = require("busboy");
const dotenv = require("dotenv");
const fs = require("fs");
const pdf = require("./modules/generate-pdf");
const email = require("./modules/send-email");

dotenv.config();
const emailHandler = email.getEmailHandler(process.env.API_KEY);
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Express server running!</h1>");
});

app.post("/generate-pdf", (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const body = {};
  busboy.on("field", function (fieldname, val) {
    body[fieldname] = val;
  });
  busboy.on("finish", async function () {
    // console.log(body);
    const invoice = pdf.generateInvoiceFromRequestObject(body);
    await pdf.generatePDF(invoice, "invoice.pdf");
    const attachment = fs
      .readFileSync(`${__dirname}/invoice.pdf`)
      .toString("base64");
    emailHandler.send({
      recipients: body["recipient-email"],
      subject: `Invoice #${body["invoice-num"]}`,
      text: `${body["recipient-name"]}\n, ${body["sender-name"]} has sent you an invoice, attached below.`,
      html: `<p>${body["recipient-name"]},</p> <p>${body["sender-name"]} has sent you an invoice, attached below.</p>`,
      attachments: [
        {
          content: attachment,
          filename: "invoice.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    });
    res.send({ endpoint: "/generate-pdf POST", body });
  });
  req.pipe(busboy);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
