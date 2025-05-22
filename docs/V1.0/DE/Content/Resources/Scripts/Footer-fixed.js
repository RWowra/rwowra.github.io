function updateFooterPosition() {
  const footer = document.querySelector(".footer1");
  if (document.body.scrollHeight <= window.innerHeight) {
    footer.classList.add("fixed"); // Fixed, wenn wenig Inhalt
  } else {
    footer.classList.remove("fixed"); // Normaler Footer bei viel Inhalt
  }
}

// Beim Laden und bei Fensteränderung prüfen
window.addEventListener("load", updateFooterPosition);
window.addEventListener("resize", updateFooterPosition);
