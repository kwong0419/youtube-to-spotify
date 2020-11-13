import React from "react";
import AddForm from "../AddForm";
import Song from "./song";
// import "../css/MusicCard.css";

const MusicCard = ({ result, userAccessToken, userURI }) => {
  const display = result.map((song) => {
    return (
      <div className="individualMusicCardDiv">
        <div className="musicInfoDiv">
          {/* <h3 className="title">{song.name}</h3>
          <p className="artist">{song.artists[0].name}</p>
        </div>
        <div className="albumDiv">
          <img
            alt="album"
            className="albumImg"
            src={song.album.images[1].url}
          />  */}
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
          />
        </div>
      </div>
    );
  });
  return <div className="musicCardContainer">{display}</div>;
};

export default MusicCard;
