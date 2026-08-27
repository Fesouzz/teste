function inicializarMenuGlobal() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const searchBox = document.querySelector(".search-box");
  const searchBtn = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-input");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => mainNav.classList.toggle("active"));
  }

  if (searchBtn && searchBox && searchInput) {
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = searchBox.classList.toggle("active");
      if (isActive) searchInput.focus();
    });

    document.addEventListener("click", (e) => {
      if (!searchBox.contains(e.target)) searchBox.classList.remove("active");
    });
  }
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", inicializarMenuGlobal)
  : inicializarMenuGlobal();
