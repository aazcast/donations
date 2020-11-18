const axios = require('axios');

exports.do = async (options) => {
  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    let err = {};
    if (error.response) {
      err.type = "response";
      err.data = error.response.data;
      err.status = error.response.status;
      err.headers = error.response.header;
      err.code = error.code;
    } else if (error.request) {
      err.type = "request";
      err.data = error.request;
      err.code = error.code;
    } else {
      err.type = "other";
      err.data = error.message;
      err.code = error.code;
      err.status = 1000;
    }
    throw err;
  }
}