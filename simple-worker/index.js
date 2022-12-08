const express = require("express");
const app = express();
const { Worker } = require("node:worker_threads");

const PORT = process.env.PORT ?? 5000;

app.get("/no-blocking", (req, res) => {
  res.status(200).send("No blocking");
});

app.get("/blocking", (req, res) => {
  const worker = new Worker("./operation.js");

  worker.on("message", (data) => {
    return res.status(200).send("Blocking: " + data);
  });

  worker.on("error", (error) => {
    return res.status(500).send("Internal error, " + error);
  });
});

app.listen(PORT, () => console.log("http://localhost:" + PORT));
