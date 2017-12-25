var path          = require('path');
const nunjucks    = require('nunjucks')

//var views         = require('../views')
var express = require('express')
let router = express.Router();

module.exports = router = function(app) {
  /*
  nunjucks.configure('../views', {
    autoescape: true,
    express: app
  });
  */
  //router.use('/office', require('./office'))

  app.get('/', (req, res) => {
    res.render('index.html', {test: 'test'});
  });

  app.get('/office', function(req, res) {
    res.sendFile(path.join(__dirname, '../views', 'office.html'));
  });
  app.get('/pos', function(req,res){
    res.sendFile(path.join(__dirname, '../views', 'pos.html'));
  });

  app.get('/office/:id', function(req, res){
    obj.get_cattle(req, res);
  });
  app.get('/pos/:cattle', function(req, res){
    obj.add_cattle(req, res);
  });
}


/*
var express = require('express')
let app = express();
let router = express.Router();

//nunjucks.configure('../views', { autoescape: true });
nunjucks.configure('../views', {
    autoescape: true,
    express: app
});


router.use('/office', require('./office'))
//router.use('/pos', require('./pos'))

app.get('/', (req, res) => {
  //console.log(views.index)
  //res.sendFile(path.join(__dirname, '../views/pigs', 'index.html'), {test: 'test'})
  res.render('index.html', { test: 'test' });
})
*/
//module.exports = router
