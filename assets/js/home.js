(function () {
  "use strict";

  function initSignalStories() {
    var mediaElement = document.querySelector("[data-signal-media]");
    var contentElement = document.querySelector("[data-signal-content]");
    if (!mediaElement || !contentElement || !window.Swiper) return;
    if (mediaElement.dataset.swiperReady === "true" || contentElement.dataset.swiperReady === "true") return;

    var mediaSwiper = new window.Swiper(mediaElement, {
      speed: 700,
      effect: "fade",
      fadeEffect: { crossFade: true },
      allowTouchMove: false,
      watchSlidesProgress: true,
      a11y: { enabled: true }
    });

    var contentSwiper = new window.Swiper(contentElement, {
      speed: 700,
      slidesPerView: 1,
      autoHeight: true,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: "[data-signal-prev]", nextEl: "[data-signal-next]" },
      pagination: { el: "[data-signal-pagination]", type: "fraction" },
      a11y: { enabled: true }
    });

    mediaSwiper.controller.control = contentSwiper;
    contentSwiper.controller.control = mediaSwiper;
    mediaElement.dataset.swiperReady = "true";
    contentElement.dataset.swiperReady = "true";
  }

  function initHome() {
    if (document.documentElement.dataset.homeReady === "true") return;
    document.documentElement.dataset.homeReady = "true";
    try { initSignalStories(); } catch (error) { console.error("Nearloom component failed: signal stories", error); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHome);
  else initHome();
}());
