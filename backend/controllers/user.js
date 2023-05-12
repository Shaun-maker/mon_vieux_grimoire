const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
    console.log(req.body.password);
};