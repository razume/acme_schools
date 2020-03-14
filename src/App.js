import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import './App.css';
import StudentForm from './components/StudentForm';
import SchoolForm from './components/SchoolForm';
import UnenrolledList from './components/UnenrolledList';
import SchoolList from './components/SchoolList';
import UpdateSchool from './components/UpdateSchool';
import UpdateStudent from './components/UpdateStudent';

export default function App() {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [unenrolledStudents, setUnenrolledStudents] = useState([]);

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  useEffect(() => {
    Promise.all([axios.get('/api/schools'), axios.get('/api/students')])
      .then(responses => responses.map(response => response.data))
      .then(results => {
        setSchools(results[0]);
        setStudents(results[1]);
        setUnenrolledStudents(
          results[1].filter(student => !student.enrollment_status)
        );
      });
  }, []);

  const { view } = params;

  const createStudent = ev => {
    ev.preventDefault();
    const inputSchool = document.querySelector('[name="school-name"]').value;
    const newStudentName = document.querySelector('[name="student-name"]')
      .value;
    const newStudentSchool = schools.filter(
      school => school.school_name === inputSchool
    )[0];
    const newStudentSchoolId = newStudentSchool
      ? newStudentSchool.school_id
      : null;
    const newStudentEnrollmentStatus = newStudentSchoolId ? true : false;

    const newStudent = {
      student_name: newStudentName,
      enrollment_status: newStudentEnrollmentStatus,
      school_id: newStudentSchoolId
    };

    if (newStudent.enrollment_status) {
      axios
        .post('/api/students', newStudent)
        .then(response => response.data)
        .then(student => setStudents([...students, student]));
    } else {
      axios
        .post('/api/students', newStudent)
        .then(response => response.data)
        .then(student =>
          setUnenrolledStudents([...unenrolledStudents, student])
        );
    }
  };

  const createSchool = ev => {
    ev.preventDefault();
    const newSchoolName = document.querySelector('[name="new-school-name"]')
      .value;
    axios
      .post('/api/schools', { school_name: newSchoolName })
      .then(response => response.data)
      .then(school => setSchools([...schools, school]));
  };

  const enroll = ev => {
    const studentToEnroll = students.filter(
      student => student.student_name === ev.target.value
    )[0];
    const newSchoolId = ev.target.getAttribute('school-id');
    studentToEnroll.enrollment_status = true;
    studentToEnroll.school_id = newSchoolId;
    axios
      .put(`/api/students/${studentToEnroll.student_id}`, studentToEnroll)
      .then(() => {
        setStudents([...students]);
        setUnenrolledStudents(
          students.filter(student => !student.enrollment_status)
        );
      });
  };

  const unenroll = studentToUnenroll => {
    studentToUnenroll.enrollment_status = false;
    studentToUnenroll.school_id = null;
    axios
      .put(`/api/students/${studentToUnenroll.student_id}`, studentToUnenroll)
      .then(response =>
        setUnenrolledStudents([...unenrolledStudents, response.data])
      );
  };

  const deleteStudent = id => {
    axios.delete(`/api/students/${id}`).then(() => {
      axios.get('/api/students').then(response => setStudents(response.data));
    });
  };

  return (
    <div>
      <a href="#view=home">
        <h1>Acme Schools</h1>
      </a>
      <ul>
        <li>{schools.length} Schools</li>
        <li>
          {' '}
          {students.length} Students (
          {students.length - unenrolledStudents.length} enrolled)
        </li>
      </ul>
      {view === 'home' && (
        <div>
          <div className="forms-container">
            <StudentForm createStudent={createStudent} schools={schools} />
            <SchoolForm createSchool={createSchool} />
          </div>
          <UnenrolledList unenrolledStudents={unenrolledStudents} />
          <SchoolList
            view={view}
            schools={schools}
            students={students}
            enroll={enroll}
            unenroll={unenroll}
          />
        </div>
      )}
      {view === 'school' && (
        <UpdateSchool schools={schools} setSchools={setSchools} />
      )}
      {view === 'student' && (
        <UpdateStudent
          students={students}
          setStudents={setStudents}
          schools={schools}
          unenrolledStudents={unenrolledStudents}
          setUnenrolledStudents={setUnenrolledStudents}
          deleteStudent={deleteStudent}
        />
      )}
    </div>
  );
}
