/**
 * Server start
 * server.js
 */

const path = require('path');

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });

// Set the time zone of the application
process.env.TZ = 'America/Costa_Rica';

// Setting a global variable with url of the root of the project
global.__basedir = __dirname;

const serverApp = require(path.join(__dirname, 'app.js'));
const port = process.env.PORT || 4000;

const server = serverApp.listen(port, ()=> {
  console.log(`Server running → ${server.address().port} 🚀`);
});