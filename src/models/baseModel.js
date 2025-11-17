import db from '../db/knex.js';

export const BaseModel = (tableName) => ({
  create: async (data) => {
    const [row] = await db(tableName).insert(data).returning('*');
    return row;
  },
  knex: () => db(tableName),

  getAll: async () => {
    return db(tableName).select('*');
  },
  count: async () => {
    const result = await db(tableName).count('* as total');
    if (result && result.length > 0) {
      return parseInt(result[0].total, 10);
    }
    return 0;
  },

  getById: async (id) => {
    return db(tableName).where({ id }).first();
  },

  findBy: async (column, value) => {
    return db(tableName)
      .where({ [column]: value })
      .first();
  },

  update: async (id, data) => {
    const [row] = await db(tableName).where({ id }).update(data).returning('*');
    return row;
  },

  delete: async (id) => {
    return db(tableName).where({ id }).del();
  },
});
