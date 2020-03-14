import React from 'react';
import axios from 'axios';

export default function UpdateStudent({
  students,
  setStudents,
  schools,
  unenrolledStudents,
  setUnenrolledStudents,
  deleteStudent
}) {
  const studentId = location.hash.slice(17);

  const currentStudent = students.filter(
    student => student.student_id === studentId
  )[0];

  const updateStudent = ev => {
    ev.preventDefault();
    const updatedStudentName = ev.target.children[0].value;
    const updatedStudentId = currentStudent.student_id;
    const updatedStudentSchool = ev.target.children[1].value;
    const updatedStudentSchoolId = schools.filter(
      school => school.school_name === updatedStudentSchool
    )[0].school_id;
    const updatedEnrollmentStatus = updatedStudentSchoolId ? true : false;

    const updatedStudent = {
      student_name: updatedStudentName,
      student_id: updatedStudentId,
      school_id: updatedStudentSchoolId,
      enrollment_status: updatedEnrollmentStatus
    };

    const unUpdatedStudents = students.filter(
      student => student.student_id !== updatedStudentId
    );

    const updatedUnenrolledStudents = !currentStudent.enrollment_status
      ? unenrolledStudents.filter(
          student => student.student_id !== currentStudent.student_id
        )
      : [...unenrolledStudents];

    console.log(updatedUnenrolledStudents);

    axios
      .put(`/api/students/${updatedStudentId}`, updatedStudent)
      .then(response => {
        setStudents([...unUpdatedStudents, response.data]);
        setUnenrolledStudents([...updatedUnenrolledStudents]);
      });
  };

  return (
    <div>
      <h2>Update Student</h2>
      <form onSubmit={updateStudent}>
        <input defaultValue={currentStudent.student_name} type="text" />
        <select>
          {schools.map(school => {
            return <option key={school.school_id}>{school.school_name}</option>;
          })}
        </select>
        <button type="submit">Update</button>
      </form>
      <button
        onClick={() => deleteStudent(currentStudent.student_id)}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}
