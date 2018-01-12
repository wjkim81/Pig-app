
http = require('http');
parseString = require('xml2js').parseString;



//module.export = openapi = function(butcheryYmd) {
var butcheryYmd = '20180105';

  //var xhr = new XMLHttpRequest();
var baseUrl = 'http://openapi.ekape.or.kr/rest/user/grade/confirminfo/pig/ownerlist';
//console.log('HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq')
var apiKey = 'HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq';
var farmUniqueNo = '600741';
//console.log(apiKey);
var url = baseUrl + '?apiKey=' + apiKey + '&issueYmd=' + butcheryYmd + '&farmUniqueNo=' + farmUniqueNo;

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
    console.log(xmldata);
    console.log('Parsed json')
    parseString(xmldata, parseOption, (err, jsData) => {
      console.log(JSON.stringify(jsData, null, 2));
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
