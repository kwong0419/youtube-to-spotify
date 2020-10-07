import React, { useState, useEffect } from "react";
import Main from "./Main";
import axios from "axios";
/* global chrome */

const CLIENT_ID = encodeURIComponent("7c15aba07d5a4cf394a8b745c6df7bac");
const RESPONSE_TYPE = encodeURIComponent("token");
const REDIRECT_URI = encodeURIComponent(
  "https://enlcncnogcnflpiioonanamloaggnemm.chromiumapp.org/"
);
const SCOPE = encodeURIComponent(
  "ugc-image-upload playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private user-read-playback-position user-read-recently-played user-top-read user-modify-playback-state user-read-currently-playing user-read-playback-state user-read-private user-read-email user-library-modify user-library-read user-follow-modify user-follow-read streaming app-remote-control"
);
const SHOW_DIALOG = encodeURIComponent("true");
let STATE = "";
let ACCESS_TOKEN = "";

let user_signed_in = false;

const create_spotify_endpoint = () => {
  STATE = encodeURIComponent(
    "meet" + Math.random().toString(36).substring(2, 15)
  );

  let oauth2_url = `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&state=${STATE}
&scope=${SCOPE}
&show_dialog=${SHOW_DIALOG}
`;

  console.log(oauth2_url);

  return oauth2_url;
};

const UserOauthDisplay = ({ userAccessToken, setUserAccessToken }) => {
  const userOauthFlow = () => {
    chrome.identity.launchWebAuthFlow(
      {
        url: create_spotify_endpoint(),
        interactive: true,
      },

      function (redirect_url) {
        if (chrome.runtime.lastError) {
          //   sendResponse({ message: "fail" });
          console.log("fail1");
          console.log(chrome.runtime.lastError);
        } else {
          if (redirect_url.includes("callback?error=access_denied")) {
            // sendResponse({ message: "fail" });
            console.log("fail2");
          } else {
            ACCESS_TOKEN = redirect_url.substring(
              redirect_url.indexOf("access_token=") + 13
            );

            ACCESS_TOKEN = ACCESS_TOKEN.substring(0, ACCESS_TOKEN.indexOf("&"));
            let state = redirect_url.substring(
              redirect_url.indexOf("state=") + 6
            );

            setUserAccessToken(ACCESS_TOKEN);
            if (state === STATE) {
              console.log("SUCCESS");
              user_signed_in = true;
              setTimeout(() => {
                ACCESS_TOKEN = "";
                user_signed_in = false;
                chrome.storage.sync.set({ SK: "" }, function () {
                 
                });
              }, 7200000);

              chrome.browserAction.setPopup(
                { popup: "./index.html" },
                () => {}
              );
              chrome.storage.sync.set({ SK: ACCESS_TOKEN }, function () {
                console.log("Value is set to " + ACCESS_TOKEN);
              });
            }
          }
        }
      }
    );
    return ACCESS_TOKEN;
  };

  const handleClick = async () => {
    // chrome.runtime.sendMessage({ message: "login" }, function (response) {
    //   if (response.message === "success") window.close();
    //   console.log("hi");
    //   setUserId("20");
    // });
    userOauthFlow();
  };

  return (
    <>
      {userAccessToken ? (
        <Main userAccessToken={userAccessToken} />
      ) : (
        <div>
          <body>
            <h1>Sign-In With Your Spotify Account to Use This Extension</h1>
            <button onClick={handleClick} id="sign-in">
              Sign In
            </button>
          </body>
        </div>
      )}
    </>
  );
};

export default UserOauthDisplay;
