// Update with your config settings.
require('dotenv').config({ path: './.env' });

let connectionfile = {
  database: process.env.DATABASENAME,
  user:     process.env.DATABASEUSER,
  password: process.env.DATABASEPASS,
  host: process.env.DATABASEHOST,
  port: process.env.DATABASEPORT,
}

if (process.env.NODE_ENV !== 'development') {
  connectionfile = {
    database: process.env.DATABASENAME,
    user:     process.env.DATABASEUSER,
    password: process.env.DATABASEPASS,
    host: process.env.DATABASEHOST,
    port: process.env.DATABASEPORT,
    ssl: true,
    rejectUnauthorized: true
  }
}

module.exports = {
  development: {
    client: 'pg',
    connection: connectionfile,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'pg_migrations'
    }
  },
  staging: {
    client: 'pg',
    connection: connectionfile,
    pool: {
      min: 2,
      max: 50
    },
    migrations: {
      tableName: 'pg_migrations'
    }
  },
  production: {
    client: 'pg',
    connection: connectionfile,
    pool: {
      min: 2,
      max: 400
    },
    migrations: {
      tableName: 'pg_migrations'
    }
  }
};
