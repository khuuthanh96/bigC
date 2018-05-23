const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const localUri = 'mongodb://localhost/eshopper';
function getDatabaseUri() {
    if(process.env.NODE_ENV === 'production') {
        return 'mongodb://eshopper:123321@ds157682.mlab.com:57682/thanhsuper'
    }
    return localUri
}

mongoose.connect(getDatabaseUri())
.catch(error => {
    console.log(error);
    process.exit(1);
});