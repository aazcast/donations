const schedule = require('node-schedule');
const service = require('../services/check');
/**
 * This class manages to send emails every hour.
 */
const job = schedule.scheduleJob("*/15 * * * *", function(fireDate){
  service.check();
});