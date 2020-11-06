import React, { useState, useEffect } from "react";
// import { API_KEY } from "../util/api";
import axios from "axios";
import "../css/AddForm.css";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddForm = ({ uri, song_id, userAccessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState("");
  const [showNewPlayList, setShowNewPlayList] = useState("none");
  const [togglePlaylistMessage, setTogglePlaylistMessage] = useState(false);
  const [toggleLibraryMessage, setToggleLibraryMessage] = useState(false);
  const [open, setOpen] = useState(false);

  //get all playlists
  const fetchPlaylists = async () => {
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/me/playlists`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + userAccessToken,
        },
      });
      setPlaylists(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  //snack bar close
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  //handle selected playlist
  const handleSelect = (e) => {
    setCurrentPlaylist(e.target.value);

    e.target.value === "new"
      ? setShowNewPlayList("block")
      : setShowNewPlayList("none");
  };

  //add song to a certain playlist
  const handleSubmitPlaylist = async (e) => {
    e.preventDefault();
    try {
      await axios({
        method: "post",
        url: `https://api.spotify.com/v1/playlists/${currentPlaylist}/tracks?uris=${uri}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + userAccessToken,
        },
      });
      setOpen(true);
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
          Authorization: "Bearer " + userAccessToken,
        },
      });
      setOpen(true);
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
        <select onChange={handleSelect} name="playlist" id="playlistSelect">
          <option value="" selected disabled>
            Select a Playlist
          </option>
          <option value="new" key="1">
            create new playlist
          </option>
          {playlists.map((playlist) => {
            return (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            );
          })}
        </select>
        <button
          id="playlistBtn"
          type="submit"
          class="button"
          style={{ verticalAlign: "middle" }}
        >
          <span>Add to Playlist</span>
        </button>
        <input placeholder="Youtube Playlist" display={showNewPlayList} />
      </form>
      {/* {togglePlaylistMessage ? (
        <h3 id="playlistMsg">Song successfully added to Playlist</h3>
      ) : null} */}

      <button
        id="libraryBtn"
        onClick={handleClickLibrary}
        type="click"
        style={{ verticalAlign: "middle" }}
      >
        <span>Add to Library</span>
      </button>

      {/* {toggleLibraryMessage ? (
        <h3 id="libraryMsg">Song successfully saved to Library</h3>
      ) : null} */}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Your Song has been added!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddForm;
