/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import { API_KEY, YT_API_KEY } from "../util/api";
import axios from "axios";
import "../css/Main.css";

const Main = ({ title }) => {
  const [musicRes, setMusicRes] = useState([]);
  const [showQr, setShowQr] = useState(false);
  const [userURI, setUserURI] = useState([]);

  const getUrl = async () => {
    return chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      async (tabs) => {
        let url = tabs[0].url;
        console.log("url: ", url.split("v=")[1]);
        let id = url.split("v=")[1];
        let title = await fetchYoutube(id);
        await fetchData(title);
        // use `url` here inside the callback because it's asynchronous!
      }
    );
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

  const fetchData = async (videoTitle) => {
    console.log({ videoTitle });
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/search/`,
        params: {
          q: videoTitle,
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
      console.log("musicRes: ", res.data.tracks.items);
      setMusicRes(res.data.tracks.items);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchYoutube = async (videoID) => {
    console.log("videoID: ", videoID);
    try {
      let res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            maxResults: 8,
            key: YT_API_KEY,
            type: "video",
            q: videoID,
          },
        }
      );
      let title = res.data.items[0].snippet.title;
      console.log("videoTitle: ", title);
      if (title.includes("(")) {
        title = title.split("(")[0];
      }
      console.log("videoTitle: ", title);
      return title;
    } catch (error) {
      console.log(error);
    }
  };

  const runExtension = async () => {
    fetchUser();
    getUrl();
  };

  useEffect(() => {
    // if (!userId) setOpen(true);
    runExtension();
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
        <img
          alt="profile"
          id="profileIcon"
          src="https://i.ibb.co/PhhB10N/profileimg.png"
          onClick={() => {
            setShowQr(!showQr);
          }}
        />
        <h2 className="titleTag">YouTube to Spotify</h2>
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
