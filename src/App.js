/*global chrome*/
import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import ErrorPage from "./components/Errorpage";
import "./App.css";

function App() {
  const [currentUrl, setCurrenturl] = useState("");
  const fetchWindow = () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setCurrenturl(url);
    });
  };

  useEffect(() => {
    fetchWindow();
    let a = document.querySelector(".title.ytd-video-primary-info-renderer");
    console.log("hi");
  }, []);

  return (
    <div className="App">
      {currentUrl.includes("youtube") ? <Main /> : <ErrorPage />}
    </div>
  );
}

export default App;
