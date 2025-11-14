export async function up(knex) {
  // UUID extension
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema.createTable('employees', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 150).notNullable().unique();
    table.string('address').notNullable();
    table.string('phone_number', 30);
    table.string('password', 100).notNullable();
    table.enu('role', ['teacher', 'admin'], {
      useNative: true,
      enumName: 'role_enum',
    });
    table
      .enu('status', ['active', 'inactive'], {
        useNative: true,
        enumName: 'employees_status_enum',
      })
      .defaultTo('inactive');
    table.timestamps(true, true);
  });
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('employees');
  await knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
