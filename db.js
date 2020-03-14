const pg = require('pg');
const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/schools_db'
);

client.connect();

const sync = async () => {
  const SQL = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        DROP TABLE IF EXISTS student;
        DROP TABLE IF EXISTS school;
        CREATE TABLE school(
            school_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
            school_name VARCHAR(40) NOT NULL
        );
        CREATE TABLE student(
            student_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
            student_name VARCHAR(25) NOT NULL,
            enrollment_status BOOL NOT NULL,
            school_id UUID REFERENCES school(school_id)
        );
    `;
  await client.query(SQL);

  const school1 = await createSchool({ school_name: 'FSU' });
  const school2 = await createSchool({ school_name: 'UCF' });
  const school3 = await createSchool({ school_name: 'MIT' });

  await createStudent({
    student_name: 'Leighton',
    enrollment_status: true,
    school_id: school1.school_id
  });

  await createStudent({
    student_name: 'Tom',
    enrollment_status: true,
    school_id: school1.school_id
  });

  await createStudent({
    student_name: 'Phil',
    enrollment_status: false,
    school_id: null
  });

  await createStudent({
    student_name: 'Brett',
    enrollment_status: true,
    school_id: school2.school_id
  });

  await createStudent({
    student_name: 'Moe',
    enrollment_status: true,
    school_id: school2.school_id
  });

  await createStudent({
    student_name: 'JP',
    enrollment_status: false,
    school_id: null
  });
};

const readSchool = async () => {
  return (await client.query('SELECT * FROM school')).rows;
};

const readStudent = async () => {
  return (await client.query('SELECT * FROM student')).rows;
};

const createSchool = async ({ school_name }) => {
  const SQL = 'INSERT INTO school(school_name) VALUES($1) RETURNING *';
  return (await client.query(SQL, [school_name])).rows[0];
};

const createStudent = async ({
  student_name,
  enrollment_status,
  school_id
}) => {
  const SQL =
    'INSERT INTO student(student_name, enrollment_status, school_id) VALUES($1, $2, $3) RETURNING *';
  return (await client.query(SQL, [student_name, enrollment_status, school_id]))
    .rows[0];
};

const updateSchool = async ({ school_name, school_id }) => {
  const SQL =
    'UPDATE school SET school_name = $1 WHERE school_id = $2 RETURNING *';
  const response = await client.query(SQL, [school_name, school_id]);
  return response.rows[0];
};

const updateStudent = async ({
  student_name,
  enrollment_status,
  school_id,
  student_id
}) => {
  const SQL =
    'UPDATE student SET student_name = $1, enrollment_status = $2, school_id = $3 WHERE student_id = $4 RETURNING *';
  const response = await client.query(SQL, [
    student_name,
    enrollment_status,
    school_id,
    student_id
  ]);
  return response.rows[0];
};

const deleteSchool = async id => {
  const SQL = 'DELETE FROM school WHERE school_id = $1';
  await client.query(SQL, [id]);
};

const deleteStudent = async id => {
  const SQL = 'DELETE FROM student WHERE student_id = $1';
  await client.query(SQL, [id]);
};

module.exports = {
  sync,
  createSchool,
  createStudent,
  readSchool,
  readStudent,
  updateSchool,
  updateStudent,
  deleteSchool,
  deleteStudent
};
