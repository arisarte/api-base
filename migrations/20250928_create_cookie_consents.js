export async function up(knex) {
  await knex.schema.createTable('cookie_consents', (table) => {
    table.increments('id').primary();
    table.string('ip', 100).notNullable();
    table.json('consent').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('cookie_consents');
}
