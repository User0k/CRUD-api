import { PORT } from './constants';
import { apiServer } from './api';

apiServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

apiServer.on('error', (err) => console.log(err));
