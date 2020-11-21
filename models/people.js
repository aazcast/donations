const db = require('../db.js');

class People extends db.Model {
  static get tableName() {
    return 'people';
  }
}

module.exports = People;
