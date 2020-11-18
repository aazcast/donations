
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('pg_knex_seeds_lock', table => {
      table.increments('id').primary()
      table.string('file_name', 1000),
      table.timestamp('run_at').defaultTo(knex.fn.now())
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('pg_knex_seeds_lock')
 ])
};
