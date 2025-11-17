import Joi from 'joi';

export const StudentValidation = {
  /**
   * Talaba yaratish (POST /admin/students) uchun sxema
   */
  createStudentSchema: Joi.object({
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(150).required(),

    // Yangi maydonlar
    birth_date: Joi.date()
      .iso() // YYYY-MM-DD formatini talab qilish qulay
      .max('now') // Tug'ilgan sana kelajakda bo'lmasligi kerak
      .required()
      .messages({
        'any.required': 'Tugilgan sana kiritilishi shart.',
        'date.max': 'Tugilgan sana kelajak sanasi bolishi mumkin emas.',
      }),

    enrollmentDate: Joi.date().iso().required().messages({
      'any.required': 'Oqishga qabul qilingan sana kiritilishi shart.',
    }),

    address: Joi.string().max(255).required(),
    phone_number: Joi.string().max(30).allow(null, '').optional(),

    // `status` ni formadan qabul qilmaymiz, chunki u default 'active'

    // Coursega bog'liqlik.
    course_id: Joi.string().uuid().required().messages({
      'any.required': 'Talaba qabul qilingan kurs tanlanishi shart.',
      'string.uuid': 'Kurs ID si notogri formatda.',
    }),
  }),

  // Talaba ma'lumotlarini yangilash sxemasi (masalan, parolsiz)
  updateStudentSchema: Joi.object({
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    birth_date: Joi.date().iso().max('now').required(),
    enrollmentDate: Joi.date().iso().required(),
    address: Joi.string().max(255).required(),
    phone_number: Joi.string().max(30).allow(null, '').optional(),
    status: Joi.string()
      .valid('active', 'graduated', 'suspended', 'expelled')
      .required(),
    course_id: Joi.string().uuid().required(),
  }),
};
