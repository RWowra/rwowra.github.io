document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector(".body-container");
  const footer = document.querySelector(".footer2");

  function checkScrollAndWidth() {
    const isWideEnough = window.innerWidth >= 1279;
    const isScrolledToEnd =
      content.scrollHeight - content.scrollTop <= content.clientHeight + 1;

    if (isWideEnough && isScrolledToEnd) {
      footer.style.display = "block"; // Footer anzeigen
    } else {
      footer.style.display = "none"; // Footer ausblenden
    }
  }

  // Scroll-Event und Resize-Event überwachen
  content.addEventListener("scroll", checkScrollAndWidth);
  window.addEventListener("resize", checkScrollAndWidth);

  // Direkt prüfen beim Laden
  checkScrollAndWidth();
});
