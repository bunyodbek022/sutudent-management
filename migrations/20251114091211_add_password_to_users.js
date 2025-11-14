export async function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('password', 255).notNullable(); // password qo‘shildi
  });
}

export async function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('password'); // rollback uchun ustun o‘chiriladi
  });
}
