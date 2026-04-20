import 'dotenv/config';
import { createApp } from './app.js';
import { initFirebase } from './config/firebase.js';
import { startReminderJob } from './jobs/reminderJob.js';
import { logger } from './utils/logger.js';

const port = Number(process.env.PORT) || 3001;

try {
  initFirebase();
} catch (e) {
  logger.error('firebase_init_failed', { message: e.message });
  process.exit(1);
}

startReminderJob();

const app = createApp();
app.listen(port, () => {
  logger.info('server_listen', { port });
});
