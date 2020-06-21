/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import API_KEY from "../util/api";
import axios from "axios";
import "../css/Main.css";

const Main = () => {
  const [musicRes, setMusicRes] = useState([]);
  const [showQr, setShowQr] = useState(false);
  const [userURI, setUserURI] = useState([]);

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
          q: "jay z",
          type: "track",
          market: "US",
          limit: 5,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      });
      setMusicRes(res.data.tracks.items);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/me/`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      });
      setUserURI(res.data.uri);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
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
          src="https://static.thenounproject.com/png/73078-200.png"
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
            id="qrImg"
            alt="profileQr"
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${userURI}&amp.png`}
          />
        ) : null}

        {/* <img
          alt="settings"
          src="https://img.icons8.com/material-rounded/24/000000/settings.png"
        /> */}
      </div>
      <div className="resultsList">
        {musicRes.length ? (
          <MusicCard result={musicRes} />
        ) : (
          <h3>loading ...</h3>
        )}
      </div>
    </div>
  );
};

export default Main;
