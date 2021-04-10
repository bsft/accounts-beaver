// function generatePDF() {
//   // TODO: implement generatePDF function
//   const fs = 
// }

// module.exports = generatePDF;

const fs = require('fs')
const PDFDocument = require('pdfkit');

let pdfDoc = new PDFDocument;
pdfDoc.pipe(fs.createWriteStream('SampleDocument.pdf'));
pdfDoc.text("My Sample PDF Document");
pdfDoc.end();
