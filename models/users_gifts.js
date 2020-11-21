const db = require('../db.js');

class UsersGifts extends db.Model {
  static get tableName() {
    return 'users_gifts';
  }
}

module.exports = UsersGifts;
