const Book = require('../models/Book');

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    
    const book = new Book({
        ...bookObject
    });

    book.save()
    .then(() => { res.status(201).json({ message: 'Livre enregistré !'})})
    .catch((error) => res.status(400).json({ error }));
}

exports.modifyBook = (req, res) => {
    const bookRequest = { ...req.body };
    
    // add user id check here
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        Book.updateOne({ _id: req.params.id }, { ...bookRequest })
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch((error) => res.status(401).json({ message: 'Not authorized' }));
    })
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

exports.getOneBooks = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
}