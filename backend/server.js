const PORT = 3000;
const express = require("express");
const Busboy = require("busboy");
const pdf = require("./modules/generate-pdf");

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
  busboy.on("finish", function () {
    console.log(body);
    const invoice = pdf.generateInvoiceFromRequestObject(body);
    pdf.generatePDF(invoice, "invoice.pdf");
    res.send({ endpoint: "/generate-pdf POST", body });
  });
  req.pipe(busboy);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
