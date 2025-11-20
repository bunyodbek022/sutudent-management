import Joi from 'joi';

export const StudentValidation = {
  // Talaba yaratish (POST /admin/students) uchun sxema

  createStudentSchema: Joi.object({
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(150).required(),

    birth_date: Joi.date().iso().max('now').required().messages({
      'any.required': "Tug'ilgan sana kiritilishi shart.",
      'date.max': "Tug'ilgan sana kelajak sanasi bo'lishi mumkin emas.",
    }),

    enrollmentDate: Joi.date().iso().required().messages({
      'any.required': "O'qishga qabul qilingan sana kiritilishi shart.",
    }),

    address: Joi.string().max(255).required(),
    phone_number: Joi.string().max(30).allow(null, '').optional(),

    faculty_id: Joi.string().uuid().required().messages({
      'any.required': 'Fakultet tanlanishi shart.',
      'string.uuid': "Fakultet ID si noto'g'ri formatda.",
    }),

    courses: Joi.alternatives()
      .try(Joi.string().uuid(), Joi.array().items(Joi.string().uuid()))
      .required()
      .messages({
        'any.required': 'Kamida bitta kurs tanlanishi shart.',
        'array.base': "Kurs ma'lumotlari noto'g'ri formatda.",
      }),
  }),

  // Talaba ma'lumotlarini yangilash sxemasi (PUT /admin/students/:id)

  updateStudentSchema: Joi.object({
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    birth_date: Joi.date().iso().max('now').required(),
    enrollmentDate: Joi.date().iso().required(),
    address: Joi.string().max(255).required(),
    phone_number: Joi.string().max(30).allow(null, '').optional(),

    // `status` endi faqat tahrirlashda kerak
    status: Joi.string()
      .valid('active', 'graduated', 'suspended', 'expelled')
      .required(),

    // 🚨 YANGILANGAN QISMLAR (edit.ejs dagi o'zgarishlarga mos)

    // 1. Fakultet IDsi majburiy
    faculty_id: Joi.string()
      .uuid() // Agar Fakultet ID UUID bo'lsa
      .required()
      .messages({
        'any.required': 'Fakultet tanlanishi shart.',
      }),

    courses: Joi.alternatives()
      .try(Joi.string().uuid(), Joi.array().items(Joi.string().uuid()))
      .required()
      .messages({
        'any.required': 'Kamida bitta kurs tanlanishi shart.',
      }),
  }),
};
