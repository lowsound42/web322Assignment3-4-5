const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: './static/photos/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('jpg')
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload.single('PlanPicture');
