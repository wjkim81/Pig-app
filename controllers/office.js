var path          = require('path');

var express = require('express')
  , router = express.Router()
  , Pig = require('../models/pigs')

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/pigs', 'office.html'), {test: 'test'})
})

router.get('/:id', function(req, res) {
  res.send('Hello')
})

module.exports = router