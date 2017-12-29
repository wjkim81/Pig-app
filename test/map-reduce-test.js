// Import for web server
const fs = require('fs');

// Import eatformation libraries
const helpers = require('../helpers');
const models = require('../models');
const pigsdb = require('../models/pigs');

var queryString = {
  //"startkey": "20171220",
  //"endkey": "20171229"
  //"key": ["20171228", "L117122812345000"]
  //"key": "20171228"
  "startkey": ["20171220", null],
  "endkey": ["20171230", null],
  "group_level": 3
}

pigsdb.runView('pigsDoc', 'processInfo-summary-view', (error, viewResult) => {
  console.log(viewResult.rows);
})

pigsdb.runViewWithQuery('pigsDoc', 'processInfo-summary-view', queryString, (error, viewResult) => {
  console.log(viewResult.rows);
})