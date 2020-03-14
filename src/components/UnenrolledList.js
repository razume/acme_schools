import React from 'react';

export default function UnenrolledList({ unenrolledStudents }) {
  return (
    <div className="unenrolled-container">
      <h3>Unenrolled Students</h3>
      <ul>
        {unenrolledStudents.map(student => {
          return (
            <li key={student.student_id}>
              <a href={`#view=student&id=${student.student_id}`}>
                {student.student_name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
