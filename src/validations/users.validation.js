import Joi from 'joi';

// CREATE
export const createUserSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().max(150).required(),
  birth_date: Joi.date().required(),
  enrollmentDate: Joi.date().required(),
  address: Joi.string().required(),
  phone_number: Joi.string().max(30).allow(null, ''),
  password: Joi.string().min(6).max(255).required(),
  course_id: Joi.string().uuid({ version: 'uuidv4' }).allow(null),
  status: Joi.string()
    .valid('active', 'graduated', 'suspended', 'expelled')
    .default('active'),
});

// UPDATE
export const updateUserSchema = Joi.object({
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  email: Joi.string().email().max(150),
  birth_date: Joi.date(),
  enrollmentDate: Joi.date(),
  address: Joi.string(),
  phone_number: Joi.string().max(30).allow(null, ''),
  password: Joi.string().min(6).max(255),
  course_id: Joi.string().uuid({ version: 'uuidv4' }).allow(null),
  status: Joi.string().valid('active', 'graduated', 'suspended', 'expelled'),
});

// DELETE
export const deleteUserSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
});

// VERIFY

export const verifyUserValidation = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
});

// LOGIN

export const loginUserScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
