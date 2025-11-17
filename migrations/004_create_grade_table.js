export async function up(knex) {
  return knex.schema.createTable('grade', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
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
    table.enu('score', ['A', 'B', 'C', 'D', 'E'], {
      useNative: true,
      enumName: 'score_enum',
    });
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('grade');
}
