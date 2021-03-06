'use strict';

/**
 * index.js file manages routings for various addresses.
 */
const nunjucks         = require('nunjucks')
var obj                = require('./controllers.js');

var db                 = require('../models/pigs')

var apps               = require('./app');

//var app = require('./app');
//var superlogin = require('.app');
var app = apps.app;
var sl = apps.superlogin;
var profile = apps.profile;

/**
 * Configuration for nunjucks
 * Because eatformation is currently using angular.js
 * we need to chcange variable parenthesis from {{ }} to others
 * 
 */
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


/**
 * Basic routings
 * If we need routings, define function in routing.js and import it to use
 * Never define actions here
 * 
 */
/*
app.use('/', (req, res, next) => {
  //res.header("Access-Control-Allow-Origin", "*");
  //res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //console.log('req.query');
  //console.log(req.query);
  console.log('req.originalUrl');
  console.log(req.originalUrl);
  console.log('req.baseUrl');
  console.log(req.baseUrl);
  console.log('req.headers');
  console.log(req.headers);
  console.log('req.header.authorization');
  console.log(req.header.authorization);

  next();
});
*/
app.get('/dashboard', function(req, res, next) {
  console.log('req.headers');
  console.log(req.headers);
  /*
  if (!req.header.authorization) {
    res.redirect('/login');
    console.log('req.header.authorization');
    console.log(req.header.authorization);
    return;
  }
  */
  //console.log('superlogin.passport: ');
  //console.log(sl.passport);
  //console.log('req');
  //console.log(req)
  //console.log('req.isAuthenticated()');
  //console.log(req.isAuthenticated);
  //console.log('req.session');
  //console.log(req.session);
  //res.redirect('/login');
  res.render('index.html', { test: "test" });
  //next();
});


app.get('/', (req, res) => {
  res.redirect('/login')
  //res.render('index.html', { "test": "test"});
});

app.get('/login', (req, res) => {
  res.render('login.html', { test: "test_login" });
});

app.get('/admin', (req, res) => {
  //console.log('sl.requireAuth');
  //console.log(sl.requireAuth);
  //if (sl.requireAuth) {
  //  res.redirect('/');
  //} else {
  //  res.redirect('/login');
  //}
//app.get('/admin', (req, res) => {
  //console.log('inside admin page');
  //console.log(sl);
  /*
  console.log(superlogin);
  console.log('req');
  console.log(req);
  console.log('res');
  console.log(res);
  */
  //res.render('index.html', { test: "test" });
});

app.get('/products', (req, res) => {
  res.render('products.html', { test: "test_product" });
});

app.get('/customers', (req,res) => {
  res.render('customers.html', { test: "test_customer" });
})




// Router for angular
app.get('/download_butcheryinfo_from_ekape/:issue_ymd', obj.download_butcheryinfo_from_ekape);
app.get('/get_summary_pigs_by_date/', obj.get_summary_pigs_by_date);
app.get('/query_pigs_with_date/:query_ymd', obj.query_pigs_with_date);
app.get('/create_lot_no/:trace_nos', obj.create_lot_no);
app.get('/query_lot_no_with_date/:pig_lot_ymd', obj.query_lot_no_with_date);
app.get('/create_new_process/:lotNo', obj.create_new_process);
app.get('/query_process_info_with_date/:process_date', obj.query_process_info_with_date);
app.get('/create_box/:process_info_nos_next_corp', obj.create_box);
app.get('/query_box_with_date/:box_date', obj.query_box_with_date);
app.get('/update_process_info/:process_info_in', obj.update_process_info);
app.get('/query_process_summary/:date_range', obj.query_process_summary);

app.get('/load_product_code/', obj.load_product_code);
app.get('/load_customers/', obj.load_customers);
/*
app.get('/products', (req, res) => {
  db.loadProducts((products) => {
    res.render('products.html', JSON.stringify(products));
  })
});
*/
module.exports = app;