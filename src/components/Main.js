/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import axios from "axios";

const Main = () => {
  const [musicRes, setmusicRes] = useState();

  const fetchData = async () => {
    console.log("hello");
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      console.log(url);
      // use `url` here inside the callback because it's asynchronous!
    });
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/search/`,
        params: {
          q: "drake toosie slide",
          type: "track",
          market: "US",
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer BQDjpDWNX8qZXU2NCcD9dgh_XsIZHTmhC9DHOWGcMJRHUUVtKAgNRAnk60O8-C1JRffUzWLIK5JxN9AP4iae7l_MPr_-mLsi930aqaLGRNqfGwLXEX9VaMP-WNYBWemWCQKdSISYjLjnexhvEoT8RxuU1pmRxYx_K9N3RzEs_bYzTBe_vQMCdO-zRgH_cXOAAsVlXB8FIN_8AfvtJ2VLzg7Bn86wQTg5N9sVY7LVmkawKBe2miOt-Md5OJEdIE31SlVQTUyCYF62O0NL_QXziKEM1rOSdacyk7Q0",
        },
      });
      console.log(res);
      setmusicRes(res.data.tracks.items);
    } catch (error) {
      setmusicRes(error);
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
          alt="close"
          src="https://img.icons8.com/material-rounded/24/000000/close-window.png"
        />
        <img
          alt="settings"
          src="https://img.icons8.com/material-rounded/24/000000/settings.png"
        />
      </div>
      <div className="resultsList">
        {/* <MusicCard musicRes={musicRes} /> */}
      </div>
    </div>
  );
};

export default Main;
