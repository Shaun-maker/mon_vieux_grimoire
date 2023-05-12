const Book = require('../models/Book');

exports.createBook = (req, res) => {
    const bookRequest = req.body;
    console.log(bookRequest);
    
    const book = new Book({
        ...bookRequest
    });

    book.save()
    .then(() => { res.status(201).json({ message: 'Livre enregistré !'})})
    .catch((error) => res.status(400).json({ error }));
}

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Livre supprimé !"}))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
}

exports.getAllBooks = (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
}
