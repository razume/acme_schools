import React from 'react';

export default function SchoolForm({ createSchool }) {
  return (
    <div className="form">
      <h3>Create School</h3>
      <form onSubmit={createSchool}>
        <input name="new-school-name" type="text" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
