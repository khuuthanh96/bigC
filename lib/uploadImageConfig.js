const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/images/shop"),
    filename: (req, file, cb) => {
        cb(null, `${req.body.name}-${Date.now()}.png`)
    }
});

const limits = { filesize: 1024 * 1024 }; //1MB

const upload = multer({ storage, limits });

module.exports = upload;