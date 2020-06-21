import React from "react";
import AddForm from "../AddForm";
import "../../css/musiccard.css";

const MusicCard = ({ result }) => {
  const display = result.map((song) => {
    return (
      <div className="individualMusicCardDiv">
        <div className="musicInfoDiv">
          <h3 className="title">{song.name}</h3>
          <p className="artist">{song.artists[0].name}</p>
        </div>
        <div className="album_div">
          <img
            alt="album"
            className="album_img"
            src={song.album.images[1].url}
          />
        </div>
        <AddForm uri={song.uri} song_id={song.id} />
      </div>
    );
  });
  return <div className="mainMusicCardDiv">{display}</div>;
};

export default MusicCard;
