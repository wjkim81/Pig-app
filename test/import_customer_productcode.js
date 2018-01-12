const csv = require('csvtojson')
var pigsdb        = require('../models/db')


customerCsv = './pig_data/customer_product/customers.csv'
productCodeCsv = './pig_data/customer_product/product_code.csv'

arr = [];

csv()
  //.fromFile(productCodeCsv)
  .fromFile(customerCsv)
  .on('json', (jsonObj) => {
    arr.push(jsonObj);
  })
  .on('done', (error) => {
    if (error) console.log(`[error] ${error}`);
      
    console.log(arr);
    console.log("Number of arrays: " + arr.length);

    /*
    var arrDoc = {"productCode": arr};
    //arrDoc._id = 'product_code';
    pigsdb.insert(arrDoc, 'product_code', (err, body) => {
      if (err) console.log(`[error] ${err}`);
      console.log(body);
    });
    */
    var arrDoc = {"customers": arr};
    //arrDoc._id = 'product_code';
    pigsdb.insert(arrDoc, 'customers', (err, body) => {
      if (err) console.log(`[error] ${err}`);
      console.log(body);
    });
  });