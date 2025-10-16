export type ID = string;

export type User = {
  id: ID;
  username: string;
  age: number;
  hobbies: string[];
};

export type RouteType =
  | { type: 'base' }
  | { type: 'none-id' }
  | { type: 'uuid'; id: string };
