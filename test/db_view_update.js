// Import for web server
const path          = require('path');
const fs = require('fs');



// Import eatformation libraries
const models = require('../models');
const pigsdb = require('../models/pigs');

var designDoc = {
  "views": {
    "non-processed-view": {
      "map": "function (doc) {\n  if (doc.processed == 0)\n    emit(doc._id, doc);\n}"
    },
    "pig-view": {
      "map": "function (doc) {\n  if (doc.type == \"pig\")\n    emit(doc._id, doc);\n}"
    },
    "pigLotNo-by-createdDate-view": {
      "map": "function (doc) {\n  if (doc.type == \"pigLotNo\")\n    emit(doc.createdDate, doc);\n}"
    },
    "processInfo-by-lotNo-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit(doc.lotNo, null);\n}"
    },
    "pigLotNo-view": {
      "map": "function (doc) {\n  if (doc.type == \"pigLotNo\")\n    emit(doc._id, doc);\n}"
    },
    "processInfo-by-processYmd-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit(doc.processYmd, doc);\n}"
    },
    "processInfo-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit(doc._id, doc);\n}"
    },
    "processInfo-summary-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit([doc.processYmd, doc.lotNo, doc._id], [1, parseInt(doc.processWeight), parseInt(doc.purchasingCost), parseInt(doc.sellingPrice)]);\n}",
      "reduce": "_sum"
    }
  }
}


pigsdb.update(designDoc, '_design/pigsDoc', (err, body) => {
  console.log(body);
});