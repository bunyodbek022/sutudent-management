/* eslint-disable no-unused-vars */
import { BaseModel } from '../models/baseModel';
const Users = BaseModel('users');
export const AUTHusers = {
  async create(req, res, next) {
    try {
      const info = req.body;
    } catch (err) {
      next(err);
    }
  },
};
