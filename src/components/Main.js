/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import axios from "axios";

const Main = () => {
  const [musicRes, setMusicRes] = useState([]);

  const fetchData = async () => {
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
          limit: 5,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer BQBeLo72H-xIcFPwtR80L7buFhuAaz7h04mU25R2DmDCrVqjs24AZkY2ll3_MoHn3pGcoZ18DRKjbw5vU7oTuUydcvVzGt0OVe-Y-y6Qv3SSMiKemLa2jLYx4xdQXAx80rF2qsKA-hd5dtRqLg4Vi9uiwpYKxEmMkh5rMUxO_FoarN_cLA1eMzp8cibRzYC5BW7tEh_O6VOIONzC3jyWBhXOFC1mtwHvTA1iauMuO0hK8-m6njT8YuK4OKhDAezL5-nUd50ScX7_gl1qGOqV3ACEAtbXoKrg",
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
          alt="close"
          src="https://img.icons8.com/material-rounded/24/000000/close-window.png"
        />
        <img
          alt="settings"
          src="https://img.icons8.com/material-rounded/24/000000/settings.png"
        />
      </div>
      <div className="resultsList">
        {musicRes.length ? <MusicCard result={musicRes} /> : <p>loading ...</p>}
        {/* <MusicCard result={musicRes} /> */}
      </div>
    </div>
  );
};

export default Main;
