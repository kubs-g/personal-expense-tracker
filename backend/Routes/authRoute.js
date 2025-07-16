const express = require('express');
const routes = express.Router();
const {signup, login} = require('../controller/authController');
const authenticate = require('../middleware/authMiddleware');


routes.post('/signup', signup);
routes.post('/login', login);

module.exports = routes;