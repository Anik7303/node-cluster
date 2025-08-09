import http from "node:http";
import process from "node:process";

const PORT = process.env.PORT || "3000";

// show arguments passed during invocation
// process.argv.forEach((value, index) => {
//   console.log(`[${process.pid}] ${index}: ${value}`);
// });

http
  .createServer((_, response) => {
    response.writeHead(200);
    response.write("Hello There!");
    response.end();
  })
  .listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
