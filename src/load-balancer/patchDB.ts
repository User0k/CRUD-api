import { dbInstance as db } from '../db';
import { ID, MutationMessage, Product } from '../types';

export const patchDB = () => {
  const originalAdd = db.add.bind(db);
  const originalUpdate = db.update.bind(db);
  const originalDelete = db.delete.bind(db);

  db.add = (product: Omit<Product, 'id'>) => {
    const created = originalAdd(product);
    if (typeof process.send === 'function') {
      const msg: MutationMessage = {
        type: 'db-mutation',
        originPid: process.pid,
        operation: 'add',
        product: created,
      };
      process.send(msg);
    }
    return created;
  };

  db.update = (id: ID, product: Omit<Product, 'id'>) => {
    const updated = originalUpdate(id, product);
    if (typeof process.send === 'function') {
      const msg: MutationMessage = {
        type: 'db-mutation',
        originPid: process.pid,
        operation: 'update',
        product: updated,
      };
      process.send(msg);
    }
    return updated;
  };

  db.delete = (id: ID) => {
    const deleted = originalDelete(id);
    if (deleted && typeof process.send === 'function') {
      const msg: MutationMessage = {
        type: 'db-mutation',
        originPid: process.pid,
        operation: 'delete',
        id,
      };
      process.send(msg);
    }
    return deleted;
  };
};
