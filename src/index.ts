import { PORT } from './constants';
import { apiServer } from './api';

async function start() {
  try {
    await apiServer.listen({ port: Number(PORT) });
    console.log(`Server is running on port ${PORT}.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
