import Joi from 'joi';

export const FacultyValidation = {
  createFacultySchema: Joi.object({
    name: Joi.string().max(100).required().trim().messages({
      'any.required': 'Fakultet nomi kiritilishi shart.',
      'string.empty': 'Fakultet nomi bosh bolishi mumkin emas.',
      'string.max': 'Fakultet nomi 100 belgidan oshmasligi kerak.',
    }),

    description: Joi.string().allow(null, '').trim().optional().messages({
      'string.base': 'Tavsif matn formatida bolishi kerak.',
    }),
  }),

  updateFacultySchema: Joi.object({
    name: Joi.string()
      .max(100)
      .required() // Yangilashda ham nom majburiy bo'lishi kerak
      .trim()
      .messages({
        'any.required': 'Fakultet nomi kiritilishi shart.',
        'string.empty': 'Fakultet nomi bosh bolishi mumkin emas.',
        'string.max': 'Fakultet nomi 100 belgidan oshmasligi kerak.',
      }),

    description: Joi.string().allow(null, '').trim().optional().messages({
      'string.base': 'Tavsif matn formatida bolishi kerak.',
    }),
  }),
};
