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
            "Bearer BQCy4U6GiRLdvbaJdj5t-1iiA27Cx2tmuFZjTcZCjxKZTutPoF3fD23_4kEI1Gp3eKd4FoWQXXW1L2qK3UyFoCAaTZTyqeHZygwXYE2PwvvG3O8895JMoXUMndxoMX6nqzjYaYURZBJ3YiGEZaMS7BrOF6TomXwb1LDRIKu803o5o8FC7eZsh0r1m_kachWzekizCArWMcZ5a1QMNBKUD4nGvXcu5fAxOFI4l4o9slv0NvTFqYUwe6_x6rWgKhFwUOY5wu7GgZ4gOgcQnQc5OXDUUA3h5IUV",
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
