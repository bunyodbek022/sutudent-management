import Joi from 'joi';

// CREATE
export const createCourseSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().allow('', null),
  credits: Joi.number().integer().min(0).required(),
  faculty_id: Joi.string().uuid({ version: 'uuidv4' }).allow(null),
});

// UPDATE
export const updateCourseSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().allow('', null),
  credits: Joi.number().integer().min(0),
  faculty_id: Joi.string().uuid({ version: 'uuidv4' }).allow(null),
});

// DELETE
export const deleteCourseSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
});
