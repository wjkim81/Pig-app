//SPDX-License-Identifier: Apache-2.0

/*
  This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/query.js
  and https://github.com/hyperledger/fabric-samples/blob/release/fabcar/invoke.js
 */

// call the packages we need
//var express       = require('express');        // call express
//var app           = express();                 // define our app using express
//var bodyParser    = require('body-parser');
//var http          = require('http')
//var fs            = require('fs');
//var Fabric_Client = require('fabric-client');
var path          = require('path');
var util          = require('util');
var os            = require('os');
var db            = require('../models/pigs')
var utils         = require('../helpers/utils')

module.exports = (function() {
return {
  download_butcheryinfo_from_ekape: function(req,res) {

    var issueYmd = req.params.issue_ymd;
    console.log(`Downloading butcheryInfo from Ekape through open-api issued date ${issueYmd}`);

    //console.log(issuedYmd);

    var apiKey = 'HpbHwExDWDaHWHg02BYslcfcWD6TSQ02FvrYEj3owuCWt0ijSLUeBthHqLsYMdR9f5Sq';
    db.updateButcheryInfoFromEkape(issueYmd, apiKey, (err, numResult) => {
      if (!err) {
        //console.log('done');
        res.send(numResult.toString());
      } else {
        res.send('error');
      }
    });
  },

  get_summary_pigs_by_date: function(req, res) {
    console.log(`Summary of pigs per date`);

    db.getSummaryPigsByDate((err, results) => {
      if (!err) {
        res.send(results.rows);
      } else {
        res.send('error');
      }
    });
    
  },


  query_pigs_with_date: function(req, res) {
    var queryYmd = req.params.query_ymd;
    console.log(`Getting pigs from database issued on date ${queryYmd}`);
    
    db.queryPigsWithDate(queryYmd, (err, pigsArr) => {

      if (!err) {
        //console.log(pigsArr);
        res.send(pigsArr);
      }
      else {
        res.send('error');
      }
    });
  },

  create_lot_no: function(req, res) {
    console.log("Creating new lotNo")
    
    var traceNoArr = req.params.trace_nos.split('_');
    //console.log(traceNoArr);

    //traceNoArr: [traceNo(14)-pigNo(4), ... ]
    db.createLotNo(traceNoArr, '1234', (err, newLotNo) => {
      //console.log('controller');
      //console.log(err, newLotNo);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ "error": err, "newLotNo": newLotNo }));
      /*
      if (!err)
        res.send(newLotNo);
      else
        res.send('error');
      */
    });
  },

  query_lot_no_with_date: function(req, res) {
    console.log("Query lotNo with created date")
    
    var pigLotYmd = req.params.pig_lot_ymd;
    //console.log(pigLotYmd);

    db.queryLotNoWithDate(pigLotYmd, (err, lotNoDocs) => {
      if (!err) {
        res.send(lotNoDocs.rows);
      } else {
        console.log(`[error] db.queryLotNoWithDate: err`);
        res.send('error');
      }
    });
  },

  create_new_process: function(req, res) {
    console.log("Creating new processNo");

    var lotNo = req.params.lotNo;

    db.createNewProcessNo(lotNo, (err, processNo) => {
      if (!err)
        res.send(processNo)
      else
        res.send('error');
    });
  },

  query_process_info_with_date: function(req, res) {
    console.log("Query processInfo with process date");
    
    var processDate = req.params.process_date;

    db.queryProcessInfoWithDate(processDate, (err, processInfoArr) => {
      if (!err)
        res.send(processInfoArr)
      else
        res.send('error');
    });
  },

  create_box: function(req, res) {
    console.log('Createing box with processInfo numbers')
    var input = req.params.process_info_nos_next_corp.split('-');
    var processInfoArr = input.slice(0,input.length-1)
    var nextCorp = input.slice(-1)[0];
    console.log(processInfoArr);
    console.log(nextCorp);

    db.createBox(processInfoArr, nextCorp, (err, result) => {
      if (!err)
        res.send(result);
      else
        res.send('error');
    });
  },

  query_box_with_date: function(req, res) {
    console.log(`Query box with date`);
    var boxDate = req.params.box_date;
    
    db.queryBoxWithDate(boxDate, (err, boxArr) => {
      for (var i=0; i < boxArr.length; i++) {
        console.log(boxArr);
      }
      if (!err)
        res.send(boxArr)
      else
        res.send('error');
    });

  },

  update_process_info: function(req, res) {
    console.log("Updating processInfo");

    var processInfo = req.params.process_info_in.split('-');
    //console.log(processInfo);
    db.updateProcessInfoFromApp(processInfo, (err, result) => {
      if (!err)
        res.send(result);
      else
        res.send('error');
    });
  },

  query_process_summary: function(req, res) {
    console.log("Querying summary information of processInfo");

    var dates = req.params.date_range.split('-');

    db.queryProcessSummary(dates[0], dates[1], (err, result) => {
      if (!err)
        res.send(result)
      else
        res.send('error');
    });
  },





  load_product_code: function(req, res) {
    console.log("Loading all product codes");
    db.loadProducts((products) => {
      res.send(products);
    })
  },

  load_customers: function(req, res) {
    console.log("Loading all customers");
    db.loadCustomers((customers) => {
      //console.log(customers);
      res.send(customers);
    });
  }
}
})();
