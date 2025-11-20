export async function up(knex) {
  return knex.schema.createTable('student_course', (table) => {
    table
      .uuid('student_id')
      .references('id')
      .inTable('students')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .uuid('course_id')
      .references('id')
      .inTable('course')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.primary(['student_id', 'course_id']);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('student_course');
}
