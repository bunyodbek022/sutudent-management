export async function up(knex) {
  // O'qituvchi va Kurs o'rtasidagi Ko'pga-Ko'p bog'lanish jadvali
  return knex.schema.createTable('course_teacher', (table) => {
    //O'qituvchi ID
    table
      .uuid('employee_id')
      .references('id')
      .inTable('employees')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    //Kurs ID
    table
      .uuid('course_id')
      .references('id')
      .inTable('course')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();

    table.primary(['employee_id', 'course_id']);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('course_teacher');
}
