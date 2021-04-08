const PORT = 3000;
const express = require("express");
const email = require("./modules/send-email");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Express server running!</h1>");
});

app.post("/generate-pdf", (req, res) => {
  res.send({ endpoint: "/generate-pdf POST", ...req.body });
  // email(req.body);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
