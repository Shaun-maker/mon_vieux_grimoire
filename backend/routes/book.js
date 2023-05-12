const express = require('express');

const router = express.Router();

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.post('/', bookCtrl.createBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;