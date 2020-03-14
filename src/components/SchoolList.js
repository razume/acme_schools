import React from 'react';
import Axios from 'axios';

export default function SchoolList({ schools, students, enroll, unenroll }) {
  return (
    <div className="school-list-container">
      {schools.map(school => {
        return (
          <div className="school-card" key={school.school_id}>
            <a href={`#view=school&id=${school.school_id}`}>
              <h3>{school.school_name}</h3>
            </a>
            <select school-id={school.school_id} onChange={enroll}>
              <option default value="">
                --enroll a student--
              </option>
              {students
                .filter(student => student.school_id !== school.school_id)
                .map(_student => {
                  return (
                    <option key={_student.student_id}>
                      {_student.student_name}
                    </option>
                  );
                })}
            </select>
            <ul>
              {students
                .filter(student => student.school_id === school.school_id)
                .map(_student => (
                  <li key={_student.student_id}>
                    <a href={`#view=student&id=${_student.student_id}`}>
                      {_student.student_name}
                    </a>
                    <button type="button" onClick={() => unenroll(_student)}>
                      Unenroll
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
