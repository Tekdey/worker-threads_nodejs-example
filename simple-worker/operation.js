const { parentPort } = require("node:worker_threads");

let count = 0;

for (let i = 0; i < 21_000_000; i++) {
  count++;
}

parentPort.postMessage(count);
