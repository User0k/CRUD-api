import cluster, { type Worker } from 'cluster';
import {
  MutationMessage,
  InitRequestMessage,
  HandledMessage,
  SnapshotMessage,
  AppState,
} from '../types';

export const workerCb = (
  appState: AppState,
  worker: Worker,
  message: MutationMessage | InitRequestMessage | HandledMessage,
) => {
  if (message.type === 'handled') {
    console.log(
      `Worker on port ${message.port} handled ${message.method} ${message.url}`,
    );
    return;
  }

  if (message.type === 'db-init-request') {
    const snapshot: SnapshotMessage = {
      type: 'db-snapshot',
      products: [...appState.values()],
    };
    worker.send(snapshot);
    return;
  }

  if (message.type === 'db-mutation') {
    if (message.operation === 'add' || message.operation === 'update') {
      appState.set(message.product.id, message.product);
    } else if (message.operation === 'delete') {
      appState.delete(message.id);
    }

    for (const id in cluster.workers) {
      const worker = cluster.workers[id];
      if (!worker) continue;
      if (worker.process.pid === message.originPid) continue;
      worker.send(message);
    }
    return;
  }
};
