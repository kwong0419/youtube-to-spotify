var loadfunction = window.onload;
window.onload = function (event) {
  printTitle();
  if (loadfunction) loadfunction(event);
};

function printTitle() {
  let selectedTitle = document.querySelector(
    ".title.ytd-video-primary-info-renderer"
  ).textContent;
  console.log(selectedTitle);
  if (selectedTitle.length > 0) {
    let message = {
      title: selectedTitle,
    };
    chrome.runtime.sendMessage(message);
  }
}
