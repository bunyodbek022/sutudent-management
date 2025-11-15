import Joi from 'joi';

// CREATE
export const createFacultySchema = Joi.object({
  name: Joi.string().max(150).required(),
  description: Joi.string().max(150),
});

// UPDATE
export const updateFacultySchema = Joi.object({
  name: Joi.string().max(150),
  description: Joi.string().max(150),
});

// DELETE
export const deleteFacultySchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
});
