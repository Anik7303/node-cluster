const cluster = require("node:cluster");
const http = require("node:http");
const os = require("node:os");
const process = require("node:process");

const numOfCPUs = os.availableParallelism();
const PORT = process.env.PORT || "3000";

if (cluster.isPrimary) {
  console.log(`Primary cluster manager (${process.pid}) is running...`);

  // creating workers
  for (let i = 0; i < numOfCPUs; i++) {
    const worker = cluster.fork();
    const pid = worker.process.pid;

    // adding (exit & disconnect) listeners to worker
    worker.on("exit", (code, signal) => {
      if (signal) {
        console.log(`[${pid}] worker was killed by signal: ${signal}`);
      } else if (code !== 0) {
        console.log(`[${pid}] worker exited with error code: ${code}`);
      } else {
        console.log(`[${pid}] worker died.`);
      }
    });
    worker.on("disconnect", () => {
      console.log(`[${pid}] worker disconnected!`);
    });
  }

  cluster.on("exit", (worker, _code, _signal) => {
    console.log(`[${worker.process.pid}] worker has died. Restart it.`);
  });
} else {
  // workers can share any TCP connection
  http
    .createServer((_request, response) => {
      response.writeHead(200);
      response.end("Hello There!");
      process.exit(1); // exit the process with code '1'
    })
    .listen(PORT, () => {
      console.log(
        `[${process.pid}] server running on http://localhost:${PORT}`
      );
    });
}
