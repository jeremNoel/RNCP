'use strict';

// Router = express.Router
// import {Router} from 'express';
const Router = require('express').Router;
const bodyParser = require('body-parser');

const apiRoutes = new Router();
apiRoutes.use(bodyParser.urlencoded({extended: false}));
apiRoutes.use(bodyParser.json());

const authController = require('./controllers/auth');
const userController = require('./controllers/users');
const products = require('./controllers/products');

apiRoutes.post('/users/register', authController.register);
apiRoutes.post('/users/login', authController.login);

apiRoutes.get('/users', userController.find);
// apiRoutes.post('/users', userController.create);
apiRoutes.get('users/restricted', authController.requireToken , userController.actionRestricted);

apiRoutes.get('/products', products.find);

module.exports = apiRoutes;