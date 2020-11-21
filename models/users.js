const db = require('../db.js');

class Users extends db.Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = Users;
