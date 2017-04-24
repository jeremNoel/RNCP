'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const UserModel = require('../../database').users;

function generateToken(user) {
	const payload = {
		exp: moment().add(14, 'days').unix(), // expire 14 days with moment
		iat: moment().unix(),									//issued at
		iss: user.mail,												// issuer
		sub: user.hashSync										// subject
	}
	return jwt.sign(payload, 'secret');
}

// bcrypt allow to you to hash sensitive data in your db, jwt send this data in the collection of mongodb.

function format(user) {
	const salt = bcrypt.genSaltSync(10);
	return {
		mail: user.mail,
		hash: bcrypt.hashSync(user.mail + user.pwd, salt) 
	}
}

const authController = {
	//register = methode qui permet à un nouveau utilisateur de créer un compte
	//login = user existant se connecte
	//restricter = verifier si un user est bien loggé quand il doit accéder à certaines parties de mon site
	
	register: (req,res) => {
		const newUser = new UserModel(format(req.body));
		newUser.save()
		.then(user => {
			//generate token and send back to him
			const token = generateToken(user);
			res.send(token);
		})
		.catch(err => {
			res.send('operation failed ::: ' + err);
		});
	},
	login: (req, res) => {
		UserModel.find({mail: req.body.mail})
		.then( users => {
			if (users.length > 0 && (bcrypt.compareSync(req.body.mail + req.body.pwd, users[0].hash))) {
				const token = generateToken(user[0]);
				res.send(token);
			}
			else {
				res.send('Bad password');
			}
		})
		.catch(err => {
			res.send('Operation failed ::: ' + err);
		})
	},
	requireToken: (req, res, next) => {
		const token = req.get('authorization');
		if (!token) {
			res.send('authorization required');
		}
		jwt.verify(token, 'secret', (err, decoded) => {
			//err => bad token
			// decode > moment.unix => token is expired
			if (err || decoded.exp > moment().unix) {
				res.send('Unauthorized or token expired');
			}
			else {
				next();
			}
		});
	}
}


module.exports = authController;