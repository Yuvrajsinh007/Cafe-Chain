const cron = require("node-cron");
const User = require("./models/User");

cron.schedule("0 0 * * 0", async () => { // every Sunday 00:00
  try {
    console.log("Running Top 3 bonus assignment...");

    // Reset all multipliers
    await User.updateMany({}, { hasMultiplier: false, multiplierExpiry: null });

    // Get top 3 users by XP
    const topThree = await User.find().sort({ xp: -1 }).limit(3);

    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + 7);
    nextSunday.setHours(0, 0, 0, 0);

    for (let u of topThree) {
      u.hasMultiplier = true;
      u.multiplierExpiry = nextSunday;
      await u.save();
      console.log(`✅ Multiplier assigned to ${u.name}`);
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});