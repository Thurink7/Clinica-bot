import cron from 'node-cron';
import { ReminderService } from '../services/reminderService.js';
import { logger } from '../utils/logger.js';

export function startReminderJob() {
  const svc = new ReminderService();
  cron.schedule('*/5 * * * *', async () => {
    try {
      await svc.run();
    } catch (e) {
      logger.error('reminder_job_crash', { message: e.message });
    }
  });
  logger.info('reminder_job_scheduled', { cron: '*/5 * * * *' });
}
