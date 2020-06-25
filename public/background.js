console.log("background running");

chrome.runtime.onMessage.addListener(receiver);

window.title = "";

function receiver(request, sender, sendResponse) {
  console.log(request);
  window.title = request.title;
}
