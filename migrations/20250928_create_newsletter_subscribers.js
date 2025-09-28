export async function up(knex) {
  await knex.schema.createTable('newsletter_subscribers', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('newsletter_subscribers');
}
