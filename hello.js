const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const mongodb = require('mongodb');
 

const app = express(); // Initialize the express web server
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware
 
const uploadPath = path.join(__dirname, 'data/public/'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits
 
const MongoClient = mongodb.MongoClient;

// Connect URL
const url = 'mongodb://127.0.0.1:27017';

// Connec to MongoDB
MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        return console.log(err);
    }

    // Specify database you want to access
    const db = client.db('ryanskydrive');

    console.log(`MongoDB Connected: ${url}`);
    const courses = db.collection('courses');
    courses.insertOne({ name: 'Web Security' }, (err, result) => { });
}); 

/**
 * Create route /upload which handles the post request
 */
app.route('/upload').post((req, res, next) => {
 
    req.pipe(req.busboy); // Pipe it trough busboy
 
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);
 
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream);
        file.on('data', function(data) {
          console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });

        var download_url;

        // On finish of the upload
        fstream.on('close', () => {
            fs.rename(path.join(uploadPath, filename), path.join(uploadPath, filename+'-'+Date.now()), function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            download_url = req.headers.host+ '/'+require('crypto').createHash('md5').update(filename+'-'+Date.now()).digest("hex") +'?export=1';
            console.log(download_url);
            console.log(`Upload of '${filename}' finished`);
            res.redirect('back');
        });
    });
});
 
 
/**
 * Serve the basic index.html with upload form
 */
app.route('/').get((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

app.route('/upload').get((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

app.get('/download', function(req, res){
    const file = `${__dirname}/upload-folder/dramaticpenguin.MOV`;
    res.download(file); // Set disposition and send it.
  });
 
const server = app.listen(3000, function () {
    console.log(`Listening on port ${server.address().port}`);
});