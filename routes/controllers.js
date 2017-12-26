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

var helpers      = require('../helpers');

module.exports = (function() {
return {
  get_all_unprocessed_pigs: function(req, res) {
    console.log("getting all unprocessed pigs from database: ");
    helpers.utils.getUnprocessedPigs((err, pigsArr) => {
      if (!err) 
        res.send(pigsArr.rows);
      else
        res.send(err);
    });
  }
}
})();
