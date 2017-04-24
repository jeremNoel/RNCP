'use strict';

const express = require('express');
const api = require('./api');

const routes = new express.Router();

// localhost:3000/api
routes.use('/api', api);

// localhost:3000/profile -> va etre envoyé vers public
// ou le routeur de ma single app va prendre le relais
routes.use(express.static('./public'));

module.exports = routes;