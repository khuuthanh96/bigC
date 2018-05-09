const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const localUri = 'mongodb://localhost/bigc';
function getDatabaseUri() {
    if(process.env.NODE_ENV === 'production') return 'mongodb://eshopper:123321@ds111748.mlab.com:11748/myshop'
    return localUri
}

mongoose.connect(getDatabaseUri(), { useMongoClient: true })
.catch(error => {
    console.log(error);
    process.exit(1);
});