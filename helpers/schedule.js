var db            = require('../models/pigs')
var schedule      = require('node-schedule');
var utils         = require('./utils')
 
module.exports = scheduleLoadPigs = schedule.scheduleJob('00 * * * * *', function(){
  var date = new Date();
  console.log('------------------------')
  console.log(date);
  //console.log(date.toDateString());

  var apiKey = 'HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq';

  var issueYmd = utils.getTodayYYYYMMDD();
  
  console.log(`Downloading butcheryInfo from Ekape through open-api issued date ${issueYmd}`);

  //console.log(issuedYmd);

  var apiKey = 'HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq';

  db.updateButcheryInfoFromEkape(issueYmd, apiKey, (err, numResult) => {
    var date = new Date();
    if (!err) {
      console.log(`Pigs are inserted ${numResult} at ${date}`);
    } else {
      console.log(`[error] ${error} at ${date}`);
    }
  });
});