import React from "react";
import AddForm from "../AddForm";
import "../../css/musiccard.css";

const MusicCard = (musicRes) => {
  const display = musicRes.map(() => {
    return (
      <div className="individualMusicCardDiv">
        <div className="musicInfoDiv">
          <h3 className="title">{musicRes.name}</h3>
          <p className="artist">{musicRes.artist[0].name}</p>
        </div>
        <div className="album_div">
          <img
            alt="album"
            className="album_img"
            src={musicRes.album.images[0].url}
          />
        </div>
        {/* <button id={musicRes.id}>Add to Library</button> */}
        <AddForm />
      </div>
    );
  });
  return <div className="mainMusicCardDiv">{display}</div>;
};

export default MusicCard;

// {
//         "album": {
//           "album_type": "single",
//           "artists": [
//             {
//               "external_urls": {
//                 "spotify": "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
//               },
//               "href": "https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4",
//               "id": "3TVXtAsR1Inumwj472S9r4",
//               "name": "Drake",
//               "type": "artist",
//               "uri": "spotify:artist:3TVXtAsR1Inumwj472S9r4"
//             }
//           ],
//           "external_urls": {
//             "spotify": "https://open.spotify.com/album/3xIwVbGJuAcovYIhzbLO3J"
//           },
//           "href": "https://api.spotify.com/v1/albums/3xIwVbGJuAcovYIhzbLO3J",
//           "id": "3xIwVbGJuAcovYIhzbLO3J",
//           "images": [
//             {
//               "height": 640,
//               "url": "https://i.scdn.co/image/ab67616d0000b2736443676b54522a86f6323e65",
//               "width": 640
//             },
//             {
//               "height": 300,
//               "url": "https://i.scdn.co/image/ab67616d00001e026443676b54522a86f6323e65",
//               "width": 300
//             },
//             {
//               "height": 64,
//               "url": "https://i.scdn.co/image/ab67616d000048516443676b54522a86f6323e65",
//               "width": 64
//             }
//           ],
//           "name": "Toosie Slide",
//           "release_date": "2020-04-03",
//           "release_date_precision": "day",
//           "total_tracks": 1,
//           "type": "album",
//           "uri": "spotify:album:3xIwVbGJuAcovYIhzbLO3J"
//         },
//         "artists": [
//           {
//             "external_urls": {
//               "spotify": "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
//             },
//             "href": "https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4",
//             "id": "3TVXtAsR1Inumwj472S9r4",
//             "name": "Drake",
//             "type": "artist",
//             "uri": "spotify:artist:3TVXtAsR1Inumwj472S9r4"
//           }
//         ],
//         "disc_number": 1,
//         "duration_ms": 247058,
//         "explicit": true,
//         "external_ids": {
//           "isrc": "USUG12001281"
//         },
//         "external_urls": {
//           "spotify": "https://open.spotify.com/track/127QTOFJsJQp5LbJbu3A1y"
//         },
//         "href": "https://api.spotify.com/v1/tracks/127QTOFJsJQp5LbJbu3A1y",
//         "id": "127QTOFJsJQp5LbJbu3A1y",
//         "is_local": false,
//         "is_playable": true,
//         "name": "Toosie Slide",
//         "popularity": 95,
//         "preview_url": null,
//         "track_number": 1,
//         "type": "track",
//         "uri": "spotify:track:127QTOFJsJQp5LbJbu3A1y"
//       },
