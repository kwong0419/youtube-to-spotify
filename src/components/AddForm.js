import React, { useState } from "react";

const AddForm = (id) => {
  const [playlist, setPlaylist] = useState;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      onSelect={(e) => {
        setPlaylist(e.value);
      }}
    >
      <select name="playlist" id="">
        <option value="playlist1">playlist1</option>
        <option value="playlist2">playlist2</option>
        <option value="playlist3">playlist3</option>
        <option value="playlist4">playlist4</option>
      </select>
      <input id={id} type="submit" />
    </form>
  );
};

export default AddForm;
