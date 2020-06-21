import React, { useState } from "react";

const AddForm = ({ id }) => {
  const [playlist, setPlaylist] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
return(


    <form>
      <select name="playlist">
