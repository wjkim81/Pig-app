var db         = require('../models/db')
var fs         = require('fs');


http           = require('http');
parseString    = require('xml2js').parseString;


var prettifyXml = function(sourceXml)
{
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:output omit-xml-declaration="yes" indent="yes"/>',
        '    <xsl:template match="node()|@*">',
        '      <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '    </xsl:template>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
};


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

  res.on('data', (chunk) => {
    xmldata += chunk;
  });
  res.on('end', () => {
    //console.log(xmldata);
    console.log(prettifyXml(xmldata));
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