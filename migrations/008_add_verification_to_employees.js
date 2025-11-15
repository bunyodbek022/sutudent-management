export async function up(knex) {
  return knex.schema.table('employees', (table) => {
    table.string('verification_code');
    table.timestamp('verified_at').nullable();
  });
}

export async function down(knex) {
  return knex.schema.table('employees', (table) => {
    table.dropColumn('verification_code');
    table.dropColumn('verified_at');
  });
}
