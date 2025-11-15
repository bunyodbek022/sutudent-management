import Joi from 'joi';

// CREATE
export const createEmployeeSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().max(150).required(),
  address: Joi.string().required(),
  phone_number: Joi.string().max(30).allow(null, ''),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('teacher', 'admin').default('teacher'),
  status: Joi.string().valid('active', 'inactive').default('inactive'),
});

// UPDATE
export const updateEmployeeSchema = Joi.object({
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  email: Joi.string().email().max(150),
  address: Joi.string(),
  phone_number: Joi.string().max(30).allow(null, ''),
  password: Joi.string().min(6).max(100),
  role: Joi.string().valid('teacher', 'admin'),
  status: Joi.string().valid('active', 'inactive'),
});

// DELETE
export const deleteEmployeeSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
});

//VERIFY
export const verifyEmployeeValidation = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
});

//LOGIN

export const loginEmployeeScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
