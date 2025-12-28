// server/jobs/eventCleanup.js

const cron = require('node-cron');
const Event = require('../models/Event');

// This function will find and delete events whose date has passed.
const cleanupPastEvents = async () => {
  try {
    const now = new Date();
    // Use the '$lt' (less than) operator to find events with a date before the current moment.
    const result = await Event.deleteMany({ eventDateTime: { $lt: now } });

    if (result.deletedCount > 0) {
      console.log(`[Cron Job] Successfully cleaned up ${result.deletedCount} past event(s).`);
    } else {
      console.log('[Cron Job] No past events to clean up.');
    }
  } catch (error) {
    console.error('[Cron Job] Error cleaning up past events:', error);
  }
};

// Schedule the job to run once every day at 1:00 AM.
// The cron syntax is: 'minute hour day-of-month month day-of-week'
exports.startEventCleanupJob = () => {
  cron.schedule('0 1 * * *', cleanupPastEvents, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Set to your server's timezone
  });
  // console.log('🗓️  Event cleanup job scheduled to run daily at 1:00 AM.');
};