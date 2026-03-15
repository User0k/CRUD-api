export type ID = string;

export type Product = {
  id: ID;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
};

export type AppState = Map<ID, Product>;

export type RouteType =
  | { type: 'base' }
  | { type: 'none-id' }
  | { type: 'uuid'; id: string };

export type MutationMessage =
  | {
      type: 'db-mutation';
      originPid: number;
      operation: 'add';
      product: Product;
    }
  | {
      type: 'db-mutation';
      originPid: number;
      operation: 'update';
      product: Product;
    }
  | { type: 'db-mutation'; originPid: number; operation: 'delete'; id: ID };

export type InitRequestMessage = { type: 'db-init-request' };

export type SnapshotMessage = { type: 'db-snapshot'; products: Product[] };

export type HandledMessage = {
  type: 'handled';
  url: string;
  method: string;
  port: number;
};
