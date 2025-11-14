export async function up(knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema.createTable('course', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title', 100).notNullable();
    table.text('description');
    table.smallint('credits').notNullable();
    table
      .uuid('faculty_id')
      .references('id')
      .inTable('faculty')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('course');
  await knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
