export async function up(knex) {
  return knex.schema.alterTable('students', (table) => {
    table.dropColumn('course_id');
    table
      .uuid('faculty_id')
      .references('id')
      .inTable('faculty')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')
      .nullable();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('students', (table) => {
    table.uuid('course_id').references('id').inTable('course').nullable();
    table.dropColumn('faculty_id');
  });
}
