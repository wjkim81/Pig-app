/**
 * This file is for configuration for express app
 * I put app.js here because to configure nunjucks and this makes a lot clearer code in server.js
 * index.js imports express app from here and server.js imports app from index.js
 */
const express          = require('express');
const path             = require('path');
const fileUpload       = require('express-fileupload');
const logger           = require('morgan');
const errorhandler     = require('errorhandler');
const bodyParser       = require('body-parser');
//const SuperLogin       = require('superlogin');

var helpers            = require('../helpers');
var upload             = require('./upload.js')

let app = express();

// Setting for middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(errorhandler());

// static file path
//console.log(path.join(__dirname, '../public'))
app.use('/static', express.static(path.join(__dirname,'../public')));

/**
 * This is for file uploading to receive 도축판정결과 in csv format
 * We will change this module to directly down csv or xml from ekape (축산품질평가원) using open API
 * 
 */
app.use(fileUpload());
app.post('/upload/', upload.uploadFiles);

// SuperLogin
const middlewares      = require('../middlewares')
const SuperLogin       = require('superlogin');
const superloginConfig = middlewares.superloginconfig; //require('../middlewares/superlogin/superlogin.config.js');
// load SuperLogin routes
var superlogin = new SuperLogin(superloginConfig);

app.use('/auth', superlogin.router);

var Profile = middlewares.profile;
var profile = new Profile(superlogin);
//console.log(superloginConfig)
//console.log(profile);

module.exports = {
  "app": app,
  "superlogin": superlogin,
  "profile": profile
}
