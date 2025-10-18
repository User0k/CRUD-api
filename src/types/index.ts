export type ID = string;

export type User = {
  id: ID;
  username: string;
  age: number;
  hobbies: string[];
};

export type AppState = Map<ID, User>;

export type RouteType =
  | { type: 'base' }
  | { type: 'none-id' }
  | { type: 'uuid'; id: string };

export type MutationMessage =
  | { type: 'db-mutation'; originPid: number; operation: 'add'; user: User }
  | { type: 'db-mutation'; originPid: number; operation: 'update'; user: User }
  | { type: 'db-mutation'; originPid: number; operation: 'delete'; id: ID };

export type InitRequestMessage = { type: 'db-init-request' };

export type SnapshotMessage = { type: 'db-snapshot'; users: User[] };

export type HandledMessage = {
  type: 'handled';
  url: string;
  method: string;
  port: number;
};
