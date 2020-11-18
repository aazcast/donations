const Knex = require('knex')
const connection = require('./knexfile')
const { Model } = require('objection')
const GError = require('./handlers/error/gerror');
const processError = require('./handlers/error/processError');

const knexConnection = Knex(connection.development)

Model.knex(knexConnection);

exports.Model = Model;

/**
   * Function to test if Db connection works
   * www.gravity.cr
*/  
exports.load = async () => {
  try {
    await knexConnection.raw('SELECT 1+1 as result');
    return true;
  } catch (err) {
    const error = new GError('99', 'Cant connect to DB', 500, false, err.stack);
    await processError.handle(error);
  }
}
