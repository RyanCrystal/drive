const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy

const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const mongodb = require('mongodb');
const { encrypt, decrypt } = require('./crypto');
const basicAuth = require('express-basic-auth');
// const mongoose = require("./database");

const app = express(); // Initialize the express web server
app.use(basicAuth({
    users: { 'ryanskydrive': 'fldfh' },
    // challenge: true
}))

var env = process.env.NODE_ENV || 'development';

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

app.set("view engine", "pug");
app.set("views", "views");

const uploadPath = path.join(__dirname, 'data/public/'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

app.use(express.static(path.join(__dirname, "public")));


/**
 * Create route /upload which handles the post request
 */
app.route('/upload').post((req, res, next) => {

    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {

        console.log(`Upload of '${filename}' started`);

        var newFilename = filename;
        var nameParts = filename.split('.');
        var namePartsNum = nameParts.length;

        if (namePartsNum >= 2) {
            nameParts[namePartsNum - 2] = nameParts[namePartsNum - 2] + '-' + Date.now();
            console.log(nameParts)
            newFilename = nameParts.join('.');

            console.log(newFilename)
        } else {
            newFilename = newFilename + '-' + Date.now();
        }


        // }

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, newFilename));
        // Pipe it trough
        file.pipe(fstream);
        file.on('data', function (data) {
            //   console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });

        var download_url;

        // On finish of the upload
        fstream.on('close', () => {
            var hash = encrypt(newFilename);

            download_url = req.headers.host + '/download/public/' + hash.iv + '/' + hash.content;
            console.log(download_url);
            console.log(`Upload of '${filename}' finished`);
            var protocol = env == 'development' ? 'http' : 'https';
            var payload = {
                'protocol': protocol,
                'download_url': download_url,
                'back_url': protocol + "://" + req.headers.host
            }
            res.status(200).render('zh/success', payload)

            return res.end();
        });
    });
});


/**
 * Serve the basic index.html with upload form
 */
app.route('/').get((req, res) => {
    // console.log(req)
    // console.log(req.headers["accept-language"]);
    var lang = req.acceptsLanguages('fr', 'zh-tw', 'zh', 'zh-cn', 'en');
    console.log(lang)
    if (lang && lang.substring(0, 2) == 'zh') {

        res.status(200).render("zh/home");
        return res.end();
    }

    res.status(200).render("home");
    return res.end();


});

app.route('/upload').get((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

app.get('/download/public/:iv/:content', function (req, res) {

    const hash = {
        iv: req.params.iv,
        content: req.params.content
    };
    filename = decrypt(hash);

    file = path.join(uploadPath, filename);
    var name = filename;
    var nameParts = filename.split('.');
    var namePartsNum = nameParts.length;
    var nameWithoutExtension
    if (namePartsNum >= 2) {
        nameWithoutExtension = nameParts[namePartsNum - 2];
        nameWithoutExtension = nameWithoutExtension.split('-');
        if (nameWithoutExtension.length >= 2) {
            nameWithoutExtension.pop();
        }
        nameParts[namePartsNum - 2] = nameWithoutExtension.join('-');
        name = nameParts.join('.')
    } else {
        nameWithoutExtension = filename.split('-');
        nameWithoutExtension.pop();
        name = nameWithoutExtension.join('-');
    }

    res.download(file, name); // Set disposition and send it.
});

const server = app.listen(3005, function () {
    console.log(`Listening on port ${server.address().port}`);
});