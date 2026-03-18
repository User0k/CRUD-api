import process from 'node:process';

import { dbInstance as db } from '../db';
import { InitRequestMessage, MutationMessage, SnapshotMessage } from '../types';
import { patchDB } from './patchDB';

export function workerDbSync() {
  if (typeof process.send === 'function') {
    const initMsg: InitRequestMessage = { type: 'db-init-request' };
    process.send(initMsg);
  }

  process.on('message', (message: MutationMessage | SnapshotMessage) => {
    if (message.type === 'db-snapshot') {
      db.products.clear();
      for (const product of message.products) {
        db.products.set(product.id, product);
      }
      return;
    }

    if (message.type === 'db-mutation') {
      if (message.originPid === process.pid) return;
      if (message.operation === 'add' || message.operation === 'update') {
        db.products.set(message.product.id, message.product);
      } else if (message.operation === 'delete') {
        db.products.delete(message.id);
      }
    }
  });

  patchDB();
}
