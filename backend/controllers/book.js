const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);

    if (!req.file) return;
    
    const imagePath = "/images/" + req.file.filename;
    
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}${imagePath}`
    });

    sharp(imagePath)
        .resize(800)
        .toFile(req.file.filename)
        .then(() => {
            console.log("Resize image " + req.file.filename);
        })
        .catch((error) => console.log(error)); 

    book.save()
    .then(() => { res.status(201).json({ message: 'Livre enregistré !'})})
    .catch((error) => res.status(400).json({ error }));
}

exports.modifyBook = (req, res) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorized' });
        } else {
            /* If we update images, we want to delete the old images */
            if (req.file) {
                const oldFilePath = "images/" + book.imageUrl.split("/images/")[1];
                fs.unlink(oldFilePath, (error) => {
                    if (error) console.log(error);
                });
            }
            Book.updateOne({ _id: req.params.id }, { ...bookObject })
            .then(() => res.status(200).json({ message: 'Livre modifié !' }))
            .catch((error) => res.status(401).json({ error }));
        }
    })
    .catch((error) => res.status(400).json({ error }));
}

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorized' });
        }
        else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "Livre supprimé !"}))
                .catch((error) => res.status(401).json({ error }));
            })
        }
    })
    .catch((error) => res.status(500).json({ error }));
}

exports.getAllBooks = (req, res) => {
    Book.find()
    .then(books =>  res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
}

exports.getBestBooks = (req, res, next) => {
    Book.find()
    .then((book) => {
        const topRatedBooks = book.sort((a, b) => {
            return b.averageRating - a.averageRating;
        })
        .slice(0, 3);
        res.status(200).json(topRatedBooks);
    })
    .catch((error) => res.status(404).json({ error }));
}

exports.rateBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (book.userId === req.auth.userId) {
            res.status(401).json({ message: "Not authorized" });
        }
        else {
            book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
            let count = 0;
            let total = 0;
            book.ratings.forEach(rating => {
                total += rating.grade;
                count++;
            });
            const avg = Math.round(total / count);
            Book.updateOne({ _id: req.params.id }, { ratings: book.ratings, averageRating: avg })
            .then(() => res.status(200).json( book ))
            .catch((error) => res.status(401).json({ message: "Mon erreur" }));
        }
    })
    .catch((error) => res.status(404).json({ error }));
}