const sharp = require ('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

module.exports = (req, res, next) => {
    let name = req.file.originalname.split(' ').join('_').split(".").shift();
    const extension = MIME_TYPES[req.file.mimetype];
    name += Date.now() + '.' + extension;

    req.file.filename = name;

    sharp(req.file.buffer)
    .resize({ height: 500 })
    .toFile(`images/${name}`)
    .catch((error) => console.log(error));
    next();
}