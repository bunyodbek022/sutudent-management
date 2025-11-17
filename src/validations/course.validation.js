import Joi from 'joi';

export const CourseValidation = {
  createCourseSchema: Joi.object({
    title: Joi.string().max(100).required().trim().messages({
      'any.required': 'Kurs nomi (title) kiritilishi shart.',
      'string.empty': 'Kurs nomi bosh bolishi mumkin emas.',
      'string.max': 'Kurs nomi 100 belgidan oshmasligi kerak.',
    }),

    description: Joi.string().allow(null, '').trim().optional(),

    credits: Joi.number().integer().min(1).max(30).required().messages({
      'any.required': 'Kreditlar soni kiritilishi shart.',
      'number.base': 'Kreditlar soni butun son bolishi kerak.',
      'number.min': 'Kreditlar soni kamida 1 bolishi kerak.',
    }),

    faculty_id: Joi.string().uuid().required().messages({
      'any.required': 'Fakultet tanlanishi shart.',
      'string.uuid': 'Fakultet ID si notoʻgʻri formatda.',
    }),
    teacher_ids: Joi.array()
      .items(Joi.string().uuid())
      .single()
      .required()
      .allow(null),
  }),

  updateCourseSchema: Joi.object({
    title: Joi.string().max(100).required().trim(),
    description: Joi.string().allow(null, '').trim().optional(),
    credits: Joi.number().integer().min(1).max(30).required(),
    faculty_id: Joi.string().uuid().required(),
    teacher_ids: Joi.array()
      .items(Joi.string().uuid())
      .single()
      .optional()
      .allow(null),
  }),
};
