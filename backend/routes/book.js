const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({ message: "Requête GET bien reçue, route OK !"});
});

module.exports = router;