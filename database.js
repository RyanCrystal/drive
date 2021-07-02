//The require(‘mongoose’) call above returns a Singleton object. 
//It means that the first time you call require(‘mongoose’), it 
//is creating an instance of the Mongoose class and returning it. 
//On subsequent calls, it will return the same instance that was 
//created and returned to you the first time because of how module 
//import/export works in ES6.
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb://127.0.0.1:27017")
            .then(() => {
                console.log("database connection successful");
            })
            .catch((err) => {
                console.log("database connection error " + err);
            })
    }
}

module.exports = new Database();

// const MongoClient = mongodb.MongoClient;

// // Connect URL
// const url = 'mongodb://127.0.0.1:27017';

// // Connec to MongoDB
// MongoClient.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, (err, client) => {
//     if (err) {
//         return console.log(err);
//     }

//     // Specify database you want to access
//     const db = client.db('ryanskydrive');

//     console.log(`MongoDB Connected: ${url}`);
//     const courses = db.collection('courses');
//     // courses.insertOne({ name: 'Web Security' }, (err, result) => { });
// });