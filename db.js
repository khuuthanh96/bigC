const mongoose = require('mongoose');
const initDatabase = require('./initDatabase');

mongoose.Promise = global.Promise;

const localUri = 'mongodb://localhost/bigc';
function getDatabaseUri() {
    if(process.env.NODE_ENV === 'production') {
        initDatabase();
        return 'mongodb://eshopper:123321@ds111748.mlab.com:11748/myshop'
    }
    return localUri
}

mongoose.connect(getDatabaseUri())
.catch(error => {
    console.log(error);
    process.exit(1);
});