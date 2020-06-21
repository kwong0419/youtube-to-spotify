/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import axios from "axios";
import "../css/Main.css";

const Main = () => {
  const [musicRes, setMusicRes] = useState([]);
  const [showQr, setShowQr] = useState(false);

  const fetchData = async () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      // console.log(url);
      // use `url` here inside the callback because it's asynchronous!
    });
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/search/`,
        params: {
          q: "bad bunny callaita",
          type: "track",
          market: "US",
          limit: 5,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer BQDk2AiSHtCWAM8I1rSLRD7jrSWUioGxFAwre8kTAAfM-nNeprb-TXKeKbstiYIZqGnfWt_POtkH0Q7uTM_PiQNCQkuk7edgY9s_g8U7dseNcCX7-8HV1XCDFE6yHorlx0YLj_o8mDhfCT08ILGQVQIbAmQTcuImgPJYvA9qkl3qWAh13RCiUP70ADHS_QoYvOfvw5vgDVNA9yiDwDVrOoIAFjcJ-zrozU0Ef67BFihzsx6o5rWO2kgsVFZc3qQPkf6XByt_AW8lPGVL_D9cfSdJZJ_PFGC38fY3",
        },
      });
      setMusicRes(res.data.tracks.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(showQr);
  return (
    <div className="mainComponent">
      <div className="banner">
        <img
          id="closeBtn"
          onClick={() => {
            window.close();
          }}
          alt="close"
          src="https://mpng.subpng.com/20180320/dgw/kisspng-computer-icons-symbol-circle-black-close-icon-5ab0da57bf6214.2979679915215396717839.jpg"
        />
        {/* <i class="fas fa-window-close"></i> */}
        <img
          alt="profile"
          id="profileIcon"
          src="https://i.ibb.co/PhhB10N/profileimg.png"
          onClick={() => {
            setShowQr(!showQr);
          }}
        />
        {showQr ? (
          <img
            alt="profileQr"
            src="https://api.qrserver.com/v1/create-qr-code/?data=spotify:user:96bolfks7e65hu0ydvy1sutfj&amp.png"
          />
        ) : null}

        {/* <img
          alt="settings"
          src="https://img.icons8.com/material-rounded/24/000000/settings.png"
        /> */}
      </div>
      <div className="resultsList">
        {musicRes.length ? <MusicCard result={musicRes} /> : <p>loading ...</p>}
      </div>
    </div>
  );
};

export default Main;
