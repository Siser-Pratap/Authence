// HTTPS termination for disposable production-mode CI tests only.
import https from "node:https";
import http from "node:http";
import { readFileSync } from "node:fs";

const server = https.createServer({
  key: readFileSync(process.env.AUTHENCE_TEST_TLS_KEY),
  cert: readFileSync(process.env.AUTHENCE_TEST_TLS_CERT),
}, (request, response) => {
  const upstream = http.request({
    hostname: "127.0.0.1", port: 3000, path: request.url, method: request.method,
    headers: { ...request.headers, "x-forwarded-proto": "https", "x-forwarded-for": "127.0.0.1" },
  }, (result) => {
    response.writeHead(result.statusCode, result.headers);
    result.pipe(response);
  });
  upstream.on("error", () => {
    response.writeHead(502);
    response.end("Test server unavailable");
  });
  request.pipe(upstream);
});
server.listen(3443, "127.0.0.1");
