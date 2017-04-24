'use strict';

const UserModel = require('../../database').users;

const userController = {
  find : (req, res) => {
    //recette/operation sur la base de données
    UserModel.find()
    .then( data => {
      res.send('Operation success ::: ' + data);
    })
    .catch( err => {
      res.send('Operation failed ::: ' + err);
    });
  },
  actionRestricted : (req, res) => {
    res.send('success');
  }
}

module.exports = userController;