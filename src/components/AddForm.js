import React, { useState, useEffect } from "react";
import API_KEY from "../util/api";
import axios from "axios";

const AddForm = ({ uri, song_id }) => {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState("");
  const [togglePlaylistMessage, setTogglePlaylistMessage] = useState(false);
  const [toggleLibraryMessage, setToggleLibraryMessage] = useState(false);

  const fetchPlaylists = async () => {
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/me/playlists`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      });
      setPlaylists(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitPlaylist = async (e) => {
    e.preventDefault();
    try {
      await axios({
        method: "post",
        url: `https://api.spotify.com/v1/playlists/${currentPlaylist}/tracks?uris=${uri}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      });
      setTogglePlaylistMessage(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickLibrary = async () => {
    try {
      await axios({
        method: "put",
        url: `https://api.spotify.com/v1/me/tracks?ids=${song_id}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer BQDk2AiSHtCWAM8I1rSLRD7jrSWUioGxFAwre8kTAAfM-nNeprb-TXKeKbstiYIZqGnfWt_POtkH0Q7uTM_PiQNCQkuk7edgY9s_g8U7dseNcCX7-8HV1XCDFE6yHorlx0YLj_o8mDhfCT08ILGQVQIbAmQTcuImgPJYvA9qkl3qWAh13RCiUP70ADHS_QoYvOfvw5vgDVNA9yiDwDVrOoIAFjcJ-zrozU0Ef67BFihzsx6o5rWO2kgsVFZc3qQPkf6XByt_AW8lPGVL_D9cfSdJZJ_PFGC38fY3",
        },
      });
      setToggleLibraryMessage(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="addDiv">
      <form id="formPlaylist" onSubmit={handleSubmitPlaylist}>
        <select
          onChange={(e) => setCurrentPlaylist(e.target.value)}
          name="playlist"
          id="playlistSelect"
        >
          <option value="" selected disabled>
            Select a Playlist
          </option>
          {playlists.map((playlist) => {
            return (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            );
          })}
        </select>
        <button type="submit" id="addPlaylistBtn">
          Add to Playlist
        </button>
      </form>
      {togglePlaylistMessage ? (
        <h3 style={{ color: "green" }}>Song successfully added to playlist</h3>
      ) : null}
      <button onClick={handleClickLibrary} type="click">
        Add to Library
      </button>
      {toggleLibraryMessage ? (
        <h3 style={{ color: "skyblue" }}>Song successfully saved to Library</h3>
      ) : null}
    </div>
  );
};

export default AddForm;
