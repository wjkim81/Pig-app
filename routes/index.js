/**
 * index.js file manages routings for various addresses.
 */
const nunjucks         = require('nunjucks')
var obj                = require('./controllers.js');

var apps = require('./app');

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

app.use('/', (req, res, next) => {
  //if (superlogin.authenticated()) {
  //  console.log('authenticated')
  //}
  /*
  http.get('http://localhost:3000/session', (httpres) => {
    console.log(httpres);
  })
  */
  //console.log(valid)
  /*
  profile.get(req.user._id)
    .then(function(userProfile) {
      res.status(200).json(userProfile);
    }, function(err) {
      return next(err);
    });
    */
  //console.log(profile)
  /*
  console.log(superlogin);
  console.log('req');
  console.log(req);
  console.log('res');
  console.log(res);
  */
  next();
});

app.get('/', (req, res) => {
  //console.log(profile)
  /*
  console.log(superlogin);
  console.log('req');
  console.log(req);
  console.log('res');
  console.log(res);
  */
  res.render('index.html', { "test": "test" });
});

app.get('/admin', sl.requireAuth, (req, res) => {
  //console.log(profile)
  /*
  console.log(superlogin);
  console.log('req');
  console.log(req);
  console.log('res');
  console.log(res);
  */
  res.render('index.html', { "test": "test" });
});

app.get('/login', (req, res) => {
  res.render('login.html', { "test": "test_login" });
})

// Router for angular
app.get('/download_butcheryinfo_from_ekape/:issued_ymd', obj.download_butcheryinfo_from_ekape);
app.get('/query_pigs_with_date/:query_ymd', obj.query_pigs_with_date);
app.get('/create_lot_no/:trace_nos', obj.create_lot_no);
app.get('/query_lot_no_with_date/:pig_lot_ymd', obj.query_lot_no_with_date);
app.get('/create_new_process/:lotNo', obj.create_new_process);
app.get('/query_process_info_with_date/:process_date', obj.query_process_info_with_date);
app.get('/update_process_info/:process_info_in', obj.update_process_info);
app.get('/query_process_summary/:date_range', obj.query_process_summary);

module.exports = app;