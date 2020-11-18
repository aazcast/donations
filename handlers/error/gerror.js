/**
   * Error creator to handle it later 
   * @param {String} errorcode Error code that i want to assign
   * @param {String} errormessage Pretty error message to show to the user
   * @param {Number} status Status code to send to the user
   * @param {Boolean} operational This error is operational true or not false
   * www.gravity.cr
*/

class GError extends Error {
  constructor (errorcode = '', errormessage = '', status = 400, operational = true, stack, email = false, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GError);
    }

    // Custom debugging information
    this.status = status;
    this.code = errorcode;
    this.message = errormessage;
    this.date = new Date().toLocaleString('es-CR');
    this.operational = operational;
    this.stack = stack;
    this.email = email;
  }
}

module.exports = GError;