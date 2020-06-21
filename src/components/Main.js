/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import axios from "axios";
import "../css/Main.css";

const Main = () => {
  const [musicRes, setMusicRes] = useState([]);

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
            "Bearer BQDsqA3noeAAsfcmV63JrdO_HQQ72jZP451OuyJeKRIWVDo--V8mOux-lRqh4mPiizpn5VUj36vDN_7R2-3ZMRljsIzt4CNAs-XMx-KvyHIT9dngg48He5IfkV_ScQDn5qT5iGHMLgCd_GUu_QUi6zKHp7RQ1D7zMVCXVXkESa-izfQ2fclNR9Xcm8KpNbzY0ExPTNUTTP63ExSLFKSBvHN4vdlg6oLH7g776UXeilwPjqH35OpO64cal6oYYX5DmiwjODfLLfAL3wVCvoJAL4U671q_vetVxxnh",
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

  return (
    <div className="mainComponent">
      <div className="banner">
        <img
          id="closeBtn"
          onClick={() => {
            window.close();
          }}
          alt="close"
          src="https://img.icons8.com/material-rounded/24/000000/close-window.png"
        />
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
