import React from 'react';

export default function StudentForm({ createStudent, schools }) {
  return (
    <div className="form">
      <h3>Create Student</h3>
      <form onSubmit={createStudent}>
        <input name="student-name" type="text" />
        <select name="school-name">
          <option default value="">
            --select school--
          </option>
          {schools.map(school => {
            return <option key={school.school_id}>{school.school_name}</option>;
          })}
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
