// server/controllers/eventController.js

const Event = require('../models/Event');

exports.getActiveEvents = async (req, res) => {
  try {
    // MODIFIED: Find all events. The cron job ensures only future events exist.
    const activeEvents = await Event.find({})
      .populate('cafe', 'name address')
      .sort({ date: 1 }); // Sort by the soonest date first

    res.status(200).json(activeEvents);
  } catch (error) {
    console.error('Error fetching active events:', error);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};