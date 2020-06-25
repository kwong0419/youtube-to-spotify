import React, { useState } from "react";

const Banner = () => {
  const { showQr, setShowQr } = useState(false);

  return (
    <div className="banner">
      <img
        id="closeBtn"
        onClick={() => {
          window.close();
        }}
        alt="close"
        src="https://mpng.subpng.com/20180320/dgw/kisspng-computer-icons-symbol-circle-black-close-icon-5ab0da57bf6214.2979679915215396717839.jpg"
      />
      <h3>YouTube to Spotify</h3>
      <div>
        <img alt="user" src="https://i.ibb.co/PhhB10N/profileimg.png/" />
      </div>
      {/* <img
          alt="settings"
          src="https://img.icons8.com/material-rounded/24/000000/settings.png"
        /> */}
    </div>
  );
};

export default Banner;
