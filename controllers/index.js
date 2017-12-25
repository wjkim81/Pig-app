var path          = require('path');
//var views         = require('../views')
/*
module.exports = function(app) {

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
*/

var express = require('express')
  , router = express.Router()

router.use('/office', require('./office'))
//router.use('/pos', require('./pos'))

router.get('/', (req, res) => {
  //console.log(views.index)
  res.sendFile(path.join(__dirname, '../views/pigs', 'index.html'), {test: 'test'})
})

module.exports = router
