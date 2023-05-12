const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://apaillaud75:35q4HPV6rO6B1yCH@mon-vieux-grimoire.ozwvbml.mongodb.net/grimoire?retryWrites=true&w=majority',
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