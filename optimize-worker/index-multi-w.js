const express = require("express");
const app = express();
const { Worker } = require("node:worker_threads");

const PORT = process.env.PORT || 5000;

const THREAD_COUNT = 12;

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./multi-workers.js", {
      workerData: { thread_count: THREAD_COUNT },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (error) => {
      console.log(error);
      reject(error);
    });
  });
}

app.get("/no-blocking", (req, res) => {
  res.status(200).send("No blocking");
});

app.get("/blocking", async (req, res) => {
  try {
    const workerPromesises = [];

    for (let i = 0; i < THREAD_COUNT; i++) {
      workerPromesises.push(createWorker());
    }

    const thread_results = await Promise.all(workerPromesises);
    let total = 0;

    for (let i = 0; i < thread_results.length; i++) {
      total += thread_results[i];
    }

    return res.status(200).send("blocking total : " + total);
  } catch (error) {
    return res.status(500).send("Internal error, " + error);
  }
});

app.listen(PORT, () => console.log("http://localhost:" + PORT));
