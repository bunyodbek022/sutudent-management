import 'dotenv/config';

export default {
  development: {
    client: 'pg',
    // eslint-disable-next-line no-undef
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations' },
  },
};
