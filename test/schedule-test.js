var schedule = require('node-schedule');
 
var j = schedule.scheduleJob('00 * * * * *', function(){
  var date = new Date();
  console.log('------------------------')
  console.log(date);
  console.log(date.toDateString());
});