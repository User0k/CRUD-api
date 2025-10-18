import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

import { apiServer } from '../api';
import { PORT } from '../constants';
import {
  AppState,
  HandledMessage,
  InitRequestMessage,
  MutationMessage,
} from '../types';
import { workerDbSync } from './syncDB';
import { workerCb } from './worker';
import { setupBalancer } from './balancer';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  const workerPorts: number[] = [];
  const appState: AppState = new Map();

  for (let i = 1; i < numCPUs; i++) {
    const worker = cluster.fork({ WORKER_PORT: String(+PORT + i) });
    workerPorts.push(+PORT + i);

    worker.on(
      'message',
      (message: MutationMessage | InitRequestMessage | HandledMessage) => {
        workerCb(appState, worker, message);
      },
    );
  }

  setupBalancer(workerPorts).listen(PORT, () => {
    console.log(`Load balancer ${process.pid} listening on port ${PORT}`);
  });
} else {
  const workerPort = Number(process.env.WORKER_PORT);

  apiServer.listen(workerPort, () => {
    console.log(`Worker ${process.pid} listening on port ${workerPort}`);
  });

  workerDbSync();

  apiServer.on('request', (req) => {
    process.send?.({
      type: 'handled',
      url: req.url,
      method: req.method,
      port: workerPort,
    });
  });
}
