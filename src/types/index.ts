export type ID = string;

export type User = {
  id: ID;
  username: string;
  age: number;
  hobbies: string[];
};

export type PathType = { type: 'base' } | { type: 'id'; id: string };
// export type HTTPMethods = 'GET' | 'PUT' | 'POST' | 'DELETE';
