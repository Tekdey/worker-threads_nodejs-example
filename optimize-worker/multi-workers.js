const { parentPort, workerData } = require("node:worker_threads");

let count = 0;

for (let i = 0; i < 21_000_000 / workerData.thread_count; i++) {
  count++;
}

parentPort.postMessage(count);
