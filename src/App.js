/*global chrome*/
import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import ErrorPage from "./components/Errorpage";
import "./App.css";

function App() {
  const [currentUrl, setCurrenturl] = useState("");
  const [title, setTitle] = useState("");

  const fetchWindow = () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setCurrenturl(url);
    });
    // let bgPage = chrome.extension.getBackgroundPage();
    // setTitle(bgPage.title);
    // console.log("video title: ", title);
  };

  useEffect(() => {
    fetchWindow();
  }, []);

  return (
    <div className="App">
      {currentUrl.includes("youtube") ? <Main title={title} /> : <ErrorPage />}
    </div>
  );
}

export default App;
