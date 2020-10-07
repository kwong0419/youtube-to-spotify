/*global chrome*/
import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import ErrorPage from "./components/Errorpage";
import "./App.css";
import UserOauthDisplay from "./components/UserOauth";

function App() {
  const [currentUrl, setCurrenturl] = useState("");
  const [userAccessToken, setUserAccessToken] = useState("");
  const fetchWindow = () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setCurrenturl(url);
    });

    // let bgPage = chrome.extension.getBackgroundPage();
    // let title = bgPage.title;
    // console.log("video title: ", title);
  };

  useEffect(() => {
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
