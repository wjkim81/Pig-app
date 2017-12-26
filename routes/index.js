const express       = require('express');
const path          = require('path');
const fileUpload    = require('express-fileupload');
const nunjucks      = require('nunjucks')


var helpers         = require('../helpers');
var upload          = require('./upload.js')
var obj             = require('./controllers.js');

let app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  tags: {
    blockStart: '<%',
    blockEnd: '%>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  }
});

app.use(fileUpload());

// Basic Routings
app.get('/', (req, res) => {
  var pigsArr = [];
  //res.sendFile(path.join(__dirname, '../views', 'index.html'), { pigsArr: pigsArr.rows });
  res.render('index.html', { pigsArr: pigsArr.rows });
});

app.post('/upload', upload.uploadFiles);

// Router for angular
app.get('/get_all_unprocessed_pigs/', (req, res) => {
  obj.get_all_unprocessed_pigs(req, res);
});

module.exports = app;