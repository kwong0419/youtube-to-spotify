import React, { useState, useEffect } from "react";
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
          Authorization:
            "Bearer BQDsqA3noeAAsfcmV63JrdO_HQQ72jZP451OuyJeKRIWVDo--V8mOux-lRqh4mPiizpn5VUj36vDN_7R2-3ZMRljsIzt4CNAs-XMx-KvyHIT9dngg48He5IfkV_ScQDn5qT5iGHMLgCd_GUu_QUi6zKHp7RQ1D7zMVCXVXkESa-izfQ2fclNR9Xcm8KpNbzY0ExPTNUTTP63ExSLFKSBvHN4vdlg6oLH7g776UXeilwPjqH35OpO64cal6oYYX5DmiwjODfLLfAL3wVCvoJAL4U671q_vetVxxnh",
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
          Authorization:
            "Bearer BQDsqA3noeAAsfcmV63JrdO_HQQ72jZP451OuyJeKRIWVDo--V8mOux-lRqh4mPiizpn5VUj36vDN_7R2-3ZMRljsIzt4CNAs-XMx-KvyHIT9dngg48He5IfkV_ScQDn5qT5iGHMLgCd_GUu_QUi6zKHp7RQ1D7zMVCXVXkESa-izfQ2fclNR9Xcm8KpNbzY0ExPTNUTTP63ExSLFKSBvHN4vdlg6oLH7g776UXeilwPjqH35OpO64cal6oYYX5DmiwjODfLLfAL3wVCvoJAL4U671q_vetVxxnh",
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
            "Bearer BQDsqA3noeAAsfcmV63JrdO_HQQ72jZP451OuyJeKRIWVDo--V8mOux-lRqh4mPiizpn5VUj36vDN_7R2-3ZMRljsIzt4CNAs-XMx-KvyHIT9dngg48He5IfkV_ScQDn5qT5iGHMLgCd_GUu_QUi6zKHp7RQ1D7zMVCXVXkESa-izfQ2fclNR9Xcm8KpNbzY0ExPTNUTTP63ExSLFKSBvHN4vdlg6oLH7g776UXeilwPjqH35OpO64cal6oYYX5DmiwjODfLLfAL3wVCvoJAL4U671q_vetVxxnh",
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
