import app from './app.js';
import { PORT } from './config/env.js';
import { checkDatabaseConnection } from './config/db.js';

try {
  await checkDatabaseConnection();
  console.log('Database connected successfully');

  app.listen(PORT, () => {
    console.log(`StackVault Server listening on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to connect to database', error);
  process.exit(1);
}
