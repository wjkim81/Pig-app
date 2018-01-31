var db         = require('../models/db')
var fs         = require('fs');


var http       = require('http');
var parseString = require('xml2js').parseString;
var pd         = require('pretty-data').pd;



//module.export = openapi = function(butcheryYmd) {
var issueYmd = '20180118';

  //var xhr = new XMLHttpRequest();
var baseUrl = 'http://openapi.ekape.or.kr/rest/user/grade/confirminfo/pig/ownerlist';
//console.log('HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq')
var apiKey = 'HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq';
var farmUniqueNo = '600741';
//console.log(apiKey);
var url = baseUrl + '?apiKey=' + apiKey + '&issueYmd=' + issueYmd;

console.log(url);

//url = 'http://openapi.ekape.or.kr/rest/user/grade/confirminfo/pig/ownerlist?apiKey=HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq&issueYmd=20180105';
//console.log(url);
var parseOption = {
  explicitArray: false
};

http.get(url, (res) => {
  let xmldata = '';

  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    xmldata += chunk;
  });
  res.on('end', () => {
    //console.log(xmldata);
    //console.log(prettifyXml(xmldata));
    var xml_pp = pd.xml(xmldata);
    console.log(xml_pp);
    //console.log('Parsed json')

    //parseString(xmldata, parseOption, (err, jsData) => {
    //  console.log(JSON.stringify(jsData, null, 2));
    //})
  })

  //console.log(res);
}).on('error', (err) => {
  console.log(err);
});




/*
var pigsDocStr = fs.readFileSync('pigsDoc.json');  
var pigsDoc = JSON.parse(pigsDocStr);
console.log(pigsDoc);

db.update(pigsDoc, '_design/pigsDoc', (err, insertResult) => {
  if (err) console.log(`[error] ${err}`);

  console.log(insertResult);
});
*/