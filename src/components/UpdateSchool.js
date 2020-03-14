import React from 'react';
import axios from 'axios';

export default function UpdateSchool({ schools, setSchools }) {
  const schoolId = location.hash.slice(16);
  const currentSchool = schools.filter(
    school => school.school_id === schoolId
  )[0];

  const currentSchoolName = currentSchool ? currentSchool.school_name : '';

  const updateSchool = ev => {
    ev.preventDefault();
    const updatedSchoolName = ev.target.children[0].value;
    const updatedSchoolId = currentSchool.school_id;

    const updatedSchool = {
      school_id: updatedSchoolId,
      school_name: updatedSchoolName
    };

    const unUpdatedSchools = schools.filter(
      school => school.school_id !== updatedSchoolId
    );
    axios
      .put(`/api/schools/${updatedSchoolId}`, updatedSchool)
      .then(response => setSchools([...unUpdatedSchools, response.data]));
  };
  return (
    <div>
      <h2>Update School</h2>
      <form onSubmit={updateSchool}>
        <input defaultValue={currentSchoolName} type="text" />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
