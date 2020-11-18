const GError = require('./gerror');

exports.handle = async (err, res) => {
  try {
    //If there is any problem with JSON malformed
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      err = new GError('98', 'The JSON is malformed', 200, true, err.stack);
    }

    if (err.operational === false) {
      process.exit(err.code ? err.code : 00);
    }

    if (res) {
      const errorDetails = {
        success: false,
        message: err.message,
        status: err.status || 200,
        code: err.code || 'error-processing',
        stack: err.stack
      };
      res.status(err.status || 200);
      res.json(errorDetails);
    }
  } catch (err) {
    // handle error inside handle error jaja
    // maybe email service is down
  }
}