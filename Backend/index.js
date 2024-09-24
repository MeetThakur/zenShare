const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
app.use(cors());

let text = fs.readFileSync("data.txt", "utf8");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/getText", (req, res) => {
  res.send(text);
});

app.post("/setText", (req, res) => {
  console.log(req.body[0].text);
  fs.writeFileSync("data.txt", req.body[0].text);
  res.send("Text has been updated");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
