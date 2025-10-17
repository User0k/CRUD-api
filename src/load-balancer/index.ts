import cluster from 'node:cluster';
import { createServer, IncomingMessage, request } from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

import { apiServer } from '../api';
import { PORT } from '../constants';
import { StatusCode } from '../types/enums';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  const workerPorts: number[] = [];

  for (let i = 1; i < numCPUs; i++) {
    const worker = cluster.fork({ WORKER_PORT: String(+PORT + i) });
    workerPorts.push(+PORT + i);

    worker.on('message', (message) => {
      if (message.type === 'handled') {
        console.log(
          `Worker on port ${message.port} handled ${message.method} ${message.url}`,
        );
      }
    });
  }

  let currentWorker = 0;

  const balancer = createServer((req, res) => {
    const targetPort = workerPorts[currentWorker];
    currentWorker = (currentWorker + 1) % workerPorts.length;

    const options = {
      hostname: 'localhost',
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = request(options, (proxyRes: IncomingMessage) => {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = proxyRes.statusCode ?? StatusCode.ServerError;
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      res.statusCode = StatusCode.ServerError;
      res.end(`Bad Gateway: ${err.message}`);
    });

    req.pipe(proxyReq, { end: true });
  });

  balancer.listen(PORT, () => {
    console.log(`Load balancer ${process.pid} listening on port ${PORT}`);
  });
} else {
  const workerPort = Number(process.env.WORKER_PORT);

  apiServer.listen(workerPort, () => {
    console.log(`Worker ${process.pid} listening on port ${workerPort}`);
  });

  apiServer.on('request', (req) => {
    process.send?.({
      type: 'handled',
      url: req.url,
      method: req.method,
      port: workerPort,
    });
  });
}
