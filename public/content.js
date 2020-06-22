// window.onload = function () {
//   let title = document.querySelector(".title.ytd-video-primary-info-renderer")
//     .innerText;
//   console.log("this is the title: " + title);
//   sessionStorage.setItem("title", title);
// };

window.addEventListener("load", printTitle);

function printTitle() {
  let selectedTitle = document.querySelector(
    ".title.ytd-video-primary-info-renderer"
  ).innerText;

  console.log(selectedTitle);
}
