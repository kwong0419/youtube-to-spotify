import axios from "axios";
console.log("testing");
var loadfunction = window.onload;
window.onload = function (event) {
  printTitle();
  if (loadfunction) loadfunction(event);
};

const printTitle = () => {
  let selectedTitle =  ''
  document.querySelector(
    ".title.ytd-video-primary-info-renderer"
  ).textContent.then(vals => { 
    console.log(vals); 
    selectedTitle = vals
}); 

  console.log("testing");
  console.log(selectedTitle + "1");
  // if (selectedTitle.length > 0) {
  //   let message = {
  //     title: selectedTitle,
  //   };
  //   chrome.runtime.sendMessage(message);
  // }
};

  // not called
});