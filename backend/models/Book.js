const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    year: {type: Number, required: true},
    urlImage: {type: String, required: true},
    rates: {type: Number},
    type: {type: String, required: true}
})

module.exports = mongoose.model('Book', bookSchema);