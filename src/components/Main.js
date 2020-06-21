/*global chrome*/
import React, { useState, useEffect } from "react";
import MusicCard from "./musicCard/MusicCards";
import axios from "axios";
import "../css/Main.css";

const Main = () => {
  const [musicRes, setMusicRes] = useState([]);

  const fetchData = async () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      // console.log(url);
      // use `url` here inside the callback because it's asynchronous!
    });
    try {
      let res = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/search/`,
        params: {
          q: "bad bunny callaita",
          type: "track",
          market: "US",
          limit: 5,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
<<<<<<< HEAD
            "Bearer BQBeLo72H-xIcFPwtR80L7buFhuAaz7h04mU25R2DmDCrVqjs24AZkY2ll3_MoHn3pGcoZ18DRKjbw5vU7oTuUydcvVzGt0OVe-Y-y6Qv3SSMiKemLa2jLYx4xdQXAx80rF2qsKA-hd5dtRqLg4Vi9uiwpYKxEmMkh5rMUxO_FoarN_cLA1eMzp8cibRzYC5BW7tEh_O6VOIONzC3jyWBhXOFC1mtwHvTA1iauMuO0hK8-m6njT8YuK4OKhDAezL5-nUd50ScX7_gl1qGOqV3ACEAtbXoKrg",
=======
            "Bearer BQDk2AiSHtCWAM8I1rSLRD7jrSWUioGxFAwre8kTAAfM-nNeprb-TXKeKbstiYIZqGnfWt_POtkH0Q7uTM_PiQNCQkuk7edgY9s_g8U7dseNcCX7-8HV1XCDFE6yHorlx0YLj_o8mDhfCT08ILGQVQIbAmQTcuImgPJYvA9qkl3qWAh13RCiUP70ADHS_QoYvOfvw5vgDVNA9yiDwDVrOoIAFjcJ-zrozU0Ef67BFihzsx6o5rWO2kgsVFZc3qQPkf6XByt_AW8lPGVL_D9cfSdJZJ_PFGC38fY3",
>>>>>>> c3bb6cec73e4f868e2cb89a623bf473af6df5ba5
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
          id="closeBtn"
          onClick={() => {
            window.close();
          }}
          alt="close"
          src="https://mpng.subpng.com/20180320/dgw/kisspng-computer-icons-symbol-circle-black-close-icon-5ab0da57bf6214.2979679915215396717839.jpg"
        />
        {/* <img
          alt="settings"
          src="https://img.icons8.com/material-rounded/24/000000/settings.png"
        /> */}
      </div>
      <div className="resultsList">
        {musicRes.length ? <MusicCard result={musicRes} /> : <p>loading ...</p>}
      </div>
    </div>
  );
};

export default Main;
