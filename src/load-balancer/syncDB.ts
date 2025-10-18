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
      db.users.clear();
      for (const user of message.users) {
        db.users.set(user.id, user);
      }
      return;
    }

    if (message.type === 'db-mutation') {
      if (message.originPid === process.pid) return;
      if (message.operation === 'add' || message.operation === 'update') {
        db.users.set(message.user.id, message.user);
      } else if (message.operation === 'delete') {
        db.users.delete(message.id);
      }
    }
  });

  patchDB();
}
