  
const { generatePDF } = require("./generate-pdf.js");

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111,
    email: "bees@gmail.com"
  },
  sender: {
    name: "Beavers Inc.",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    country: "US",
    postal_code: 10025
  },
  items: [
    {
      item_description: "Toner Cartridge",
      quantity: 2,
      amount: 6000
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000, //total amount of everything in cents
  shipping_costs: 1000, //shipping cost in cents
  amount_paid: 0,
  terms: "Net 30",
  due: "April 16, 2021",
//  invoice_date: "March 16, 2021",
  invoice_nb: 1234,
  tax: 8,
  notes: "Stuff that wants to be added in the footer"
};

generatePDF(invoice, "invoice.pdf");