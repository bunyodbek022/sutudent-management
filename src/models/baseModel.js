import db from '../db/knex.js';

export const BaseModel = (tableName) => ({
  create: async (data) => {
    const [row] = await db(tableName).insert(data).returning('*');
    return row;
  },

  getAll: async () => {
    return db(tableName).select('*');
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
