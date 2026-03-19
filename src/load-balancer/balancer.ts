import { createServer, IncomingMessage, request } from 'node:http';
import { StatusCode } from '../types/enums';

export const setupBalancer = (workerPorts: number[]) => {
  let currentWorker = 0;

  return createServer((req, res) => {
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
      res.end(`Internal server error: ${err.message}`);
    });

    req.pipe(proxyReq, { end: true });
  });
};
