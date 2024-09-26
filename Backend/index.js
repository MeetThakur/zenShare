const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
}
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server working");
});

app.get("/getText", (req, res) => {
  if (!req.query.id) {
    res.send("Please enter a valid id");
    return;
  }
  const getid = req.query.id;
  pool.query(
    `SELECT text FROM data WHERE id = '${getid}';`,
  ).then((result) => {
    if (result.rows.length === 0) {
      pool.query(
        `INSERT INTO data (id, text) VALUES ('${getid}', '');`,
      ).then(res.send(""));
    } else {
      res.send(result.rows[0].text);
    }
  });
});

app.post("/setText", (req, res) => {
  const id = req.body[0].id;
  const text = req.body[0].text;
  pool.query(
    "SELECT 1 FROM data WHERE id = $1;",
    [id]
  ).then((result) => {
    if (result.rows.length === 0) {
      pool.query(
        "INSERT INTO data (id, text) VALUES ($1, $2);",
        [id, text],
      ).then(() => res.send("Data added"));
    } else {
      pool.query(
        "UPDATE data SET text = $1 WHERE id = $2;",
        [text, id],
      ).then(() => res.send("Data updated"));
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send("An error occurred");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
