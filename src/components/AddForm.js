import React, { useState } from "react";

const AddForm = ({ id }) => {
  const [playlist, setPlaylist] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
    } catch (error) {}
  };

  return (
    <form>
      <select name="playlist">
        <option value="playlist1">playlist1</option>
        <option value="playlist2">playlist2</option>
        <option value="playlist3">playlist3</option>
        <option value="playlist4">playlist4</option>
      </select>
      <input type="submit" />
    </form>
  );
};

export default AddForm;
