import cluster from "node:cluster";
import os from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execFile = resolve(__dirname, "server.mjs");
const numOfCPUs = os.availableParallelism();

if (cluster.isPrimary) {
  // https worker
  // cluster.setupPrimary({
  //   exec: execFile,
  //   args: ["--use", "https"],
  //   silent: true, // silent stdout
  // });
  // cluster.fork();

  // http worker
  // cluster.setupPrimary({
  //   exec: execFile,
  //   args: ["--use", "http"],
  // });
  // cluster.fork();

  // show all workers
  // console.log(cluster.workers);

  cluster.setupPrimary({ exec: execFile, args: ["--env", "development"] });
  for (let i = 0; i < numOfCPUs; i++) cluster.fork();

  cluster.on("fork", (worker) => {
    console.log(`[${worker.process.pid}] worker created.`);
  });
  cluster.on("exit", (worker, code, signal) => {
    const pid = worker.process.pid;
    if (signal) {
      console.log(`[${pid}] worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`[${pid}] worker exited with error code: ${code}`);
    } else {
      console.log(`[${pid}] worker died!`);
    }
    // starting new worker
    cluster.fork();
  });
}
