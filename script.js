(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".nav-links a");
  const overlays = Array.from(document.querySelectorAll("[data-parallax]"));
  const backgrounds = Array.from(document.querySelectorAll(".bg-img"));
  const textures = Array.from(document.querySelectorAll("[data-texture-parallax]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const OVERLAY_SPEED = 0.035;
  const OVERLAY_MAX_OFFSET = 14;
  const BACKGROUND_SPEED = 0.018;
  const BACKGROUND_MAX_OFFSET = 7;
  const TEXTURE_SPEEDS = [-0.034, 0.028, 0.042, -0.038];
  const TEXTURE_MAX_OFFSET = 72;

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  if ((!overlays.length && !backgrounds.length && !textures.length) || reduceMotion.matches) {
    return;
  }

  let frame = 0;

  const update = () => {
    frame = 0;
    const midpoint = window.innerHeight / 2;

    overlays.forEach((overlay) => {
      const rect = overlay.parentElement.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - midpoint;
      const offset = Math.max(-OVERLAY_MAX_OFFSET, Math.min(OVERLAY_MAX_OFFSET, distance * OVERLAY_SPEED));
      overlay.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    });

    backgrounds.forEach((background) => {
      const rect = background.parentElement.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - midpoint;
      const offset = Math.max(-BACKGROUND_MAX_OFFSET, Math.min(BACKGROUND_MAX_OFFSET, distance * -BACKGROUND_SPEED));
      background.style.setProperty("--bg-parallax-y", `${offset.toFixed(2)}px`);
    });

    textures.forEach((texture, index) => {
      const rect = texture.parentElement.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - midpoint;
      const speed = TEXTURE_SPEEDS[index] || TEXTURE_SPEEDS[0];
      const offset = Math.max(-TEXTURE_MAX_OFFSET, Math.min(TEXTURE_MAX_OFFSET, distance * speed));
      texture.style.setProperty("--texture-parallax-y", `${offset.toFixed(2)}px`);
    });
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
})();
