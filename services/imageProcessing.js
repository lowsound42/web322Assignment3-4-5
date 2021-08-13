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
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('gif')
    ) {
        cb(null, true);
    } else {
        console.log('what');
        cb(null, false);
    }
};

let upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload.single('PlanPicture');
