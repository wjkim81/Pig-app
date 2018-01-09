/**
 * index.js file manages routings for various addresses.
 */
const nunjucks         = require('nunjucks')
var obj             = require('./controllers.js');


var app = require('./app')

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


// Basic Routings
app.get('/', (req, res) => {
  res.render('index.html', { "test": "test" });
});



// Router for angular
app.get('/get_all_unprocessed_pigs/', obj.get_all_unprocessed_pigs);
app.get('/create_lot_no/:trace_nos', obj.create_lot_no);
app.get('/query_lot_no_with_date/:pig_lot_ymd', obj.query_lot_no_with_date);
app.get('/create_new_process/:lotNo', obj.create_new_process);
app.get('/query_process_info_with_date/:process_date', obj.query_process_info_with_date);
app.get('/update_process_info/:process_info_in', obj.update_process_info);
app.get('/query_process_summary/:date_range', obj.query_process_summary);

module.exports = app;