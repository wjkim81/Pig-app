const path          = require('path');
const fileUpload    = require('express-fileupload');
const helpers       = require('../helpers');

module.exports = {
  uploadFiles(req, res) {
    console.log(req.files);
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
 
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
     let csvFile = req.files.csvFile;
 
    // Use the mv() method to place the file somewhere on your server
    csvFilePath = path.join(__dirname, '../pigs_data', csvFile.name);
    console.log(csvFilePath);
    csvFile.mv(csvFilePath, function(err) {
      if (err) return res.status(500).send(err);
    
      helpers.utils.updateButcheryInfoFromEkape(csvFilePath, (numUpdated) => {
        //res.status(200);
        console.log(numUpdated + ' of pigs are updated');
        res.send(numUpdated + ' of pigs are updated');
        //setTimeout(()=>{
          //fs.unlinkSync(csvFilePath);
          // Emulate the delay of the job - async!
        //  this.emit('done', { completedOn: new Date() })
        //}, 3000)
        res.redirect('/');
      });
    });
  }
}
