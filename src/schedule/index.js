var schedule = require('node-schedule');

module.exports = {
    runSchedule: function () {
        var rule = new schedule.RecurrenceRule();
        rule.minute = 23;
        rule.hour = 15;
        schedule.scheduleJob(rule, function () {
            //run everyday at hour 15 min 19
            console.log('The answer to life, the universe, and everything!');
        });
    }
};