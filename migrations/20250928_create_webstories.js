export async function up(knex) {
  await knex.schema.createTable('webstories', (table) => {
    table.string('id', 32).primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.json('slides').notNullable();
    table.integer('author_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('webstories');
}
