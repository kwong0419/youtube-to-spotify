/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import CircularProgress from "@material-ui/core/CircularProgress";
import { YT_API_KEY } from "../util/secrets";
import axios from "axios";
import "../css/Main.css";

const Main = ({ userAccessToken }) => {
  const [musicRes, setMusicRes] = useState([]);
  const [showQr, setShowQr] = useState(false);
  const [userURI, setUserURI] = useState([]);
  const [userID, setuserID] = useState("");
  const [progress, setProgress] = useState("none");
  const [noVideoDisplay, setNoVideoDisplay] = useState("none");
  const [musictitle, setMusicTitle] = useState("");

  const getUrl = async () => {
    return chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      async (tabs) => {
        let url = tabs[0].url;

        let id = url.split("v=")[1];
        //checks if extra part to url
        if (id.includes("&")) {
          id = id.split("&")[0];
        }

        let title = await fetchYoutube(id);

        chrome.storage.sync.get(["title"], function (result) {});

        // let title = "Kendrick Lamar - HUMBLE";

        await fetchData(title);
        await setMusicTitle(title);
        // use `url` here inside the callback because it's asynchronous!
      }
    );
  };

  //gets user information
  const fetchUser = async () => {
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/me/`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + userAccessToken,
        },
      });
      // if (!res.data.uri) chrome.storage.sync.set({ SK: "" }, function () {});
      setUserURI(res.data.uri);
    } catch (error) {
      console.log(error);
      chrome.storage.sync.set({ SK: "" }, function () {});
    }
  };

  //get songs

  const fetchData = async (videoTitle) => {
    setProgress("block");
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/search/`,
        params: {
          q: videoTitle,
          type: "track",
          market: "US",
          limit: 10,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + userAccessToken,
        },
      });

      //stops progress
      setProgress("none");
      //no results
      if (!musicRes.length) {
        setNoVideoDisplay("block");
      }
      let sortedData = res.data.tracks.items.sort(function (a, b) {
        return b.popularity - a.popularity;
      });
      setMusicRes(sortedData);
    } catch (error) {
      console.log(error);
      setProgress("none");
      setNoVideoDisplay("block");
    }
  };

  //get youtube information for title
  const fetchYoutube = async (videoID) => {
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
      if (title.includes("(")) {
        title = title.split("(")[0];
      }

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
    setNoVideoDisplay("none");
    runExtension();
  }, []);

  //logout of spot
  const handleLogout = () => {
    chrome.storage.sync.set({ SK: "" }, function () {});
    window.close();
  };
  //redo Search

  const redoSearch = () => {
    fetchData(musictitle);
  };

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
        <button onClick={handleLogout}>Logout</button>

        {/* <img
          alt="settings"
          src="https://img.icons8.com/material-rounded/24/000000/settings.png"
        /> */}
      </div>
      <div className="resultsList">
        <a href="https://open.spotify.com/" target="_blank">
          <img
            src={
              "https://www.flaticon.com/svg/static/icons/svg/2111/2111627.svg"
            }
            alt="spotImg"
            id="spotImg"
          />
        </a>
        <p>search term:</p>{" "}
        <input
          value={musictitle}
          onChange={(e) => setMusicTitle(e.currentTarget.value)}
        />
        <button onClick={redoSearch}>redo-search</button>
        {musicRes.length ? (
          <MusicCard
            result={musicRes}
            userAccessToken={userAccessToken}
            userURI={userURI}
          />
        ) : (
          <p style={{ display: noVideoDisplay }}>
            oops! no result try a different video or redo search
          </p>
        )}
        <CircularProgress style={{ display: progress }} />
        <a
          id="githubLink"
          href=" https://github.com/kwong0419/Music-Extension"
          target="_blank"
        >
          <h3 color="white">FAQ or Buy Developers Coffee 🙌 ☕</h3>
        </a>
      </div>
    </div>
  );
};

export default Main;
