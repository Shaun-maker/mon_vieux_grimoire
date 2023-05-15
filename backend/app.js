const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

mongoose.connect(
  `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(error => console.log('Connexion à MongoDB échouée ! Erreur : ' + error));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;