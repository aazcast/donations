exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('people', table => {
      table.increments('id').primary()
      table.string('name'),
      table.string('lastname'),
      table.string('years'),
      table.string('type'),
      table.string('shoes_size'),
      table.string('shirt_size'),
      table.string('pants_size'),
      table.integer('status').defaultTo(1),
      table.timestamp('assigned_at')
    }),
    knex.schema.createTable('users', table => {
      table.increments('id').primary()
      table.string('name'),
      table.string('phone'),
      table.string('email'),
      table.timestamp('created_at').defaultTo(knex.fn.now())
    }),
    knex.schema.createTable('users_gifts', table => {
      table.increments('id').primary(),
      table.integer('user_id').notNullable().references('users.id'),
      table.integer('person_id').notNullable().references('people.id').unique()
    }),
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('users_gifts'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('people'),
  ])
};
