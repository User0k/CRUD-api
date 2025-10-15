import { createServer } from 'http';

import { DataBase } from './db';
import { PORT } from './constants';
import { sanitizeUrl } from './utils/sanitizeUrl';
import { HTTPMethod, StatusCode } from './types/enums';

const db = new DataBase();

const server = createServer((req, res) => {
  const { method, url } = req;
  const path = sanitizeUrl(url);

  if (!path) {
    res.statusCode = StatusCode.NotFound;
    res.end(JSON.stringify({ error: 'Incorrect api url' }));
    return;
  }

  if (method === HTTPMethod.Get && path.type === 'base') {
    res.statusCode = StatusCode.OK;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(db.getAll()));
    return;
  }

  if (method === HTTPMethod.Get && path.type === 'id') {
    const user = db.get(path.id);

    if (user) {
      res.statusCode = StatusCode.OK;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
      return;
    }

    res.statusCode = StatusCode.Invalid;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User with this id not found' }));
    return;
  }
});

server.listen(3000, () => {
  console.log(`Server is running on port ${PORT}.`);
});
