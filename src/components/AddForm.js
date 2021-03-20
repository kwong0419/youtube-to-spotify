import React, { useState, useEffect } from "react";
// import { API_KEY } from "../util/api";
import axios from "axios";
import "../css/AddForm.css";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddForm = ({
  uri,
  song_id,
  userAccessToken,
  userURI,
  playlists,
  fetchPlaylists,
}) => {

  const [currentPlaylist, setCurrentPlaylist] = useState("");
  const [showNewPlayList, setShowNewPlayList] = useState("none");
  const [nameNewPlayList, setNameNewPlayList] = useState("");
  const [togglePlaylistMessage, setTogglePlaylistMessage] = useState(false);
  const [toggleLibraryMessage, setToggleLibraryMessage] = useState(false);
  const [open, setOpen] = useState(false);


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
    console.log("on change " + e.target.value);
    e.target.value === "new"
      ? setShowNewPlayList("block")
      : setShowNewPlayList("none");
  };

  //create new playlist 
  const addNewPlayList = async () => {
    //post request takes // userURI
    
    try {
      let res = await axios({
        method: "post",
        url: `https://api.spotify.com/v1/users/${
          userURI.split("user:")[1]
        }/playlists`,
        headers: {
          Authorization: "Bearer " + userAccessToken,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          name: nameNewPlayList,
          description: "New playlist",
          public: false,
        }),
      });
      let newID = res.data.id;
      // waits for res and uses playlist id to add song
      await addSongtoPlaylist(newID);
    } catch (error) {
      console.log(error);
    }
  };

  //add song to a exisiting playlist
  const addSongtoPlaylist = async (playlistID) => {
    console.log("addSongPl" + playlistID);

    try {
      await axios({
        method: "post",
        url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=${uri}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + userAccessToken,
        },
      });
      
      //hide playlist input
      setOpen(true);
      setTogglePlaylistMessage(true);
      // reload
      fetchPlaylists();
    } catch (error) {
      console.log(error);
    }

  };

  //handle the add submit based on new or exisiting playlist
  const handleSubmitPlaylist = async (e) => {
    e.preventDefault();
    //console.log("addSongPl" + currentPlaylist);
    if (currentPlaylist === "new") {
      addNewPlayList();
    } else {
      addSongtoPlaylist(currentPlaylist);
    }
   
  };
  
  
  //handle add to library submit
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
      await setCurrentPlaylist("");
    } catch (error) {
      console.log(error);
    }
  };


//display add form component
  return (
    <div className="addDiv">
      <form id="formPlaylist">
        <select
          onChange={handleSelect}
          Classname="playlist"
          id="playlistSelect"
        >
          <option value="" selected disabled>
            Select a Playlist
          </option>
          <option value="new" key="1">
            Create New Playlist
          </option>
          {playlists.map((playlist) => {
            return (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            );
          })}
        </select>
        <input
          placeholder="Youtube Playlist"
          style={{ display: showNewPlayList, paddingTop: 5 }}
          onChange={(e) => {
            setNameNewPlayList(e.target.value);
          }}
          required
        />
        <div id="addBtn" style={{ display: "flex", flexDirection: "row" }}>
          <button
            id="playlistBtn"
            className="playlistBtn"
            type="submit"
            style={{ verticalAlign: "middle" }}
            onClick={handleSubmitPlaylist}
          >
            <span>Add to Playlist</span>
          </button>
          <button
            playlistBtn="libraryBtn"
            id="libraryBtn"
            onClick={handleClickLibrary}
            type="button"
            style={{ verticalAlign: "middle" }}
          >
            <span>Add to Library</span>
          </button>
        </div>
      </form>
    
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Your Song has been added!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddForm;
