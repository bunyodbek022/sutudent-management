export async function up(knex) {
  return knex.schema.alterTable('grade', (table) => {
    table
      .uuid('employee_id')
      .references('id')
      .inTable('employees')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')
      .nullable();
    table.unique(['student_id', 'course_id']);
  });
}

export async function down(knex) {
  return knex.schema.alterTable('grade', (table) => {
    table.dropColumn('employee_id');
    table.dropUnique(['student_id', 'course_id']);
  });
}
