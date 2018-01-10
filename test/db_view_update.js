// Import for web server
const path          = require('path');
const fs            = require('fs');



// Import eatformation libraries
const models = require('../models');
const pigsdb = require('../models/db');

var designDoc = {
  "views": {
    "non-processed-view": {
      "map": "function (doc) {\n  if (doc.processed == 0)\n    emit(doc._id, doc);\n}"
    },
    "pig-view": {
      "map": "function (doc) {\n  if (doc.type == \"pig\")\n    emit(doc._id, null);\n}"
    },
    "processInfo-by-lotNo-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit(doc.lotNo, 1);\n}",
      "reduce": "_count"
    },
    "pigLotNo-view": {
      "map": "function (doc) {\n  if (doc.type == \"pigLotNo\")\n    emit(doc._id, doc);\n}"
    },
    "processInfo-by-processYmd-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit(doc.processYmd, null);\n}"
    },
    "processInfo-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit(doc._id, null);\n}"
    },
    "processInfo-summary-view": {
      "map": "function (doc) {\n  if (doc.type == \"processInfo\")\n    emit([doc.processYmd, doc.lotNo, doc._id], [1, parseInt(doc.processWeight), parseInt(doc.purchasingCost), parseInt(doc.sellingPrice)]);\n}",
      "reduce": "_sum"
    },
    "pigLotNo-by-lotNoYmd-view": {
      "map": "function (doc) {\n  if (doc.type == \"pigLotNo\")\n    emit(doc.lotNoYmd, null);\n}"
    }
  }
}


pigsdb.update(designDoc, '_design/pigsDoc', (err, body) => {
  if (err) console.log(`[error] ${err}`);
  console.log(body);
});