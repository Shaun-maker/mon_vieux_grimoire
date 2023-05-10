const express = require('express');
const mongoose = require('mongoose');


const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.status(201);
    next();
})

app.use((req, res, next) => {
    res.json({message: "Votre requête a bien été reçue !"});
});

module.exports = app;