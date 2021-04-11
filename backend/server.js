const PORT = 3000;
const express = require("express");
const dotenv = require("dotenv");
const email = require("./modules/send-email");

dotenv.config();
const emailHandler = email.getEmailHandler(process.env.API_KEY);
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Express server running!</h1>");
});

app.post("/generate-pdf", (req, res) => {
  res.send({ endpoint: "/generate-pdf POST", ...req.body });
  // emailHandler.send(recipients, subject, text, html, attachments);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
