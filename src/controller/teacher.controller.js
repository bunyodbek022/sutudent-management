import { BaseModel } from '../models/baseModel.js';
import db from '../db/knex.js';

const Courses = BaseModel('course');
const Students = BaseModel('students');
const Grades = BaseModel('grade');
const getAssignedCourseId = async (teacherId) => {
  const assignments = await db('course_teacher')
    .where({ employee_id: teacherId })
    .select('course_id');
  return assignments.map((a) => a.course_id);
};

export const TeacherController = {
  async getDashboard(req, res, next) {
    try {
      const teacherId = req.user.id;
      const courseIds = await getAssignedCourseId(teacherId);

      const courses = await Courses.knex().whereIn('id', courseIds).select('*');

      return res.render('teacher/dashboard.ejs', {
        courses,
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
  async getCourseStudents(req, res, next) {
    try {
      const courseId = req.params.courseId;
      const teacherId = req.user.id;

      const isAssigned = await db('course_teacher')
        .where({ employee_id: teacherId, course_id: courseId })
        .first();
      if (!isAssigned) {
        return res
          .status(403)
          .send("You don't have access to join this field.");
      }

      const course = await Courses.getById(courseId);

      const studentsWithGrades = await Students.knex()
        .select(
          'students.id',
          'students.first_name',
          'students.last_name',
          'students.email'
        )
        .join('student_course', 'students.id', '=', 'student_course.student_id')
        .where('student_course.course_id', courseId)
        .leftJoin('grade', function () {
          this.on('students.id', '=', 'grade.student_id').andOn(
            'grade.course_id',
            '=',
            db.raw('?', [courseId])
          );
        })
        .select('grade.score');

      return res.render('teacher/grade_students.ejs', {
        course,
        students: studentsWithGrades,
        user: req.user,
        errors: [],
      });
    } catch (err) {
      next(err);
    }
  },

  async submitGrade(req, res, next) {
    try {
      const courseId = req.params.courseId;
      const teacherId = req.user.id;
      const { grades } = req.body;

      const gradesToSave = [];
      const validScores = ['A', 'B', 'C', 'D', 'E'];

      for (const studentId in grades) {
        const score = grades[studentId];

        if (validScores.includes(score)) {
          gradesToSave.push({
            student_id: studentId,
            course_id: courseId,
            employee_id: teacherId,
            score: score,
            updated_at: new Date(),
          });
        }
      }

      if (gradesToSave.length > 0) {
        await Grades.knex()
          .insert(gradesToSave)
          .onConflict(['student_id', 'course_id'])
          .merge(['score', 'employee_id', 'updated_at']);
      }

      return res.redirect(`/teacher/courses/${courseId}/grade`);
    } catch (err) {
      next(err);
    }
  },
};
