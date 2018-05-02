const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const URL = 'mongodb://localhost/bigc';

mongoose.connect(URL)
.catch(error => {
    console.log(error);
    process.exit(1);
});