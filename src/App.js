/*global chrome*/
import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import ErrorPage from "./components/Errorpage";
import "./App.css";
import UserOauthDisplay from "./components/UserOauth";
import axios from "axios";

function App() {
  const [currentUrl, setCurrenturl] = useState("");
  const [userAccessToken, setUserAccessToken] = useState("");
  //checks if you are currently on youtube website
  const fetchWindow = () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setCurrenturl(url);
    });

    // let bgPage = chrome.extension.getBackgroundPage();
    // let title = bgPage.title;
    // console.log("video title: ", title);
  };

  //check to see if key is valid sets the global key to empty string
  const checkUserOauthKey = async () => {
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
      if (!res.data) chrome.storage.sync.set({ SK: "" }, function () {});
    } catch (error) {
      console.log(error);
      chrome.storage.sync.set({ SK: "" }, function () {});
    }
  };

  useEffect(() => {
    // checkUserOauthKey();
    fetchWindow();

    chrome.storage.sync.get(["SK"], function (result) {
      if (result.SK) {
        setUserAccessToken(result.SK);
      } else {
        setUserAccessToken("");
      }
    });
  }, []);

  return (
    <div className="App">
      {currentUrl.includes("youtube") ? (
        <UserOauthDisplay
          userAccessToken={userAccessToken}
          setUserAccessToken={setUserAccessToken}
        />
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}

export default App;
