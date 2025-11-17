import Joi from 'joi';

// CREATE
export const createEmployeeSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().max(150).required(),
  address: Joi.string().required(),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().min(6).max(100).required().trim(),
  status: Joi.string().valid('active', 'inactive').default('inactive'),
});

// UPDATE
export const updateEmployeeSchema = Joi.object({
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100),
  address: Joi.string(),
  email: Joi.string(),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().min(6).max(100).trim(),
  role: Joi.string().valid('teacher', 'admin'),
  status: Joi.string().valid('active', 'inactive'),
});

export const updatePasswordScheme = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Yangi parollar mos kelishi kerak',
    }),
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
