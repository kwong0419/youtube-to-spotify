/*global chrome*/
import React, { useState, useEffect } from "react";
import Main from "./components/Main";
<<<<<<< HEAD
import ErrorPage from "./components/Errorpage";

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
    console.log(a);
  }, []);

=======
import "./App.css";

function App() {
>>>>>>> c3bb6cec73e4f868e2cb89a623bf473af6df5ba5
  return (
    <div className="App">
      {currentUrl.includes("youtube") ? <Main /> : <ErrorPage />}
    </div>
  );
}

export default App;
