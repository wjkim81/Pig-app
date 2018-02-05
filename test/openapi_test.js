
http = require('http');
parseString = require('xml2js').parseString;
var nano      = require('nano')('http://localhost:5984');
var db        = nano.db.use('nokdondb');

//module.export = openapi = function(butcheryYmd) {
var issueYmd = '20180105';

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

  res.on('data', (chunk) => {
    xmldata += chunk;
  });
  res.on('end', () => {
    //console.log(xmldata);
    //console.log('Parsed json')
    parseString(xmldata, parseOption, (err, jsData) => {
      //console.log(JSON.stringify(jsData, null, 2));
      var docs = jsData.pigVoes.pigVo;
      console.log(docs);
      db.bulk({"docs": docs}, (err, result) => {
        if (err) {
          console.log(`[error] odb.bulk: ${err}`);
        }

        console.log(result);
      });
    })
  })

  //console.log(res);
}).on('error', (err) => {
  console.log(err);
});

/*
  xhr.open('GET', url);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      alert('Status: '+this.status+' Headers: '+JSON.stringify(this.getAllResponseHeaders())+' Body: '+this.responseText);
    }
  };

  xhr.send('');
  */
//}

//openapi('20180105')
