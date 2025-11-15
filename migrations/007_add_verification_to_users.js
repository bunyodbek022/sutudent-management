export const up = async function (knex) {
  await knex.schema.table('users', (table) => {
    table.string('verification_code');
    table.boolean('is_active').defaultTo(false);
    table.timestamp('verified_at').nullable();
  });
};

export const down = async function (knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('verification_code');
    table.dropColumn('is_active');
    table.dropColumn('verified_at');
  });
};
