import React, { useEffect, useState } from "react";
import AddForm from "../AddForm";
import Song from "./song";
import axios from "axios";
// import "../css/MusicCard.css";

const MusicCard = ({ result, userAccessToken, userURI }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

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

  const display = result.map((song) => {
    return (
      <div className="individualMusicCardDiv">
        <div className="musicInfoDiv">
          <Song
            title={song.name}
            artist={song.artists[0].name}
            albumImg={song.album.images[1].url}
            preview_url={song.preview_url}
            explicit={song.explicit}
          />
        </div>
        <div className="addFormDiv">
          <AddForm
            uri={song.uri}
            song_id={song.id}
            userAccessToken={userAccessToken}
            userURI={userURI}
            playlists={playlists}
            fetchPlaylists={fetchPlaylists}
          />
        </div>
      </div>
    );
  });
  return <div className="musicCardContainer">{display}</div>;
};

export default MusicCard;
