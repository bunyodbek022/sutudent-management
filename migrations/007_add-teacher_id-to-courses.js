// YYYYYMMDD o'rniga hozirgi sana-vaqtni qo'ying (masalan, 20251117210000)

export async function up(knex) {
  return knex.schema.table('grade', (table) => {
    // 1. Yangi ustunni qo'shamiz
    table
      .uuid('teacher_id')
      .references('id')
      .inTable('employees')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')
      .comment('Bahoni bergan oqituvchi (employee) ID si');
  });
}

export async function down(knex) {
  return knex.schema.table('grade', (table) => {
    table.dropColumn('teacher_id');
  });
}
