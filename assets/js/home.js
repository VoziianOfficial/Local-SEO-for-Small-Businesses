(function () {
  "use strict";

  function initSignalStories() {
    var swiperElement = document.querySelector("[data-signal-swiper]");
    if (!swiperElement || !window.Swiper) return;
    if (swiperElement.dataset.swiperReady === "true") return;
    var slides = swiperElement.querySelectorAll(".swiper-slide");

    var signalSwiper = new window.Swiper(swiperElement, {
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      initialSlide: Math.floor(slides.length / 2),
      observer: true,
      observeParents: true,
      slidesPerView: "auto",
      spaceBetween: 18,
      speed: 800,
      slideToClickedSlide: true,
      keyboard: { enabled: true, onlyInViewport: true },
      pagination: { el: "[data-signal-pagination]", clickable: true },
      a11y: { enabled: true }
    });

    swiperElement.signalSwiper = signalSwiper;
    var slideTo = signalSwiper.slideTo.bind(signalSwiper);
    signalSwiper.slideNext = function () {
      slideTo((signalSwiper.activeIndex + 1) % slides.length);
    };
    signalSwiper.slidePrev = function () {
      slideTo((signalSwiper.activeIndex - 1 + slides.length) % slides.length);
    };

    function centerMiddleSlide() {
      if (typeof signalSwiper.update === "function") signalSwiper.update();
      if (typeof signalSwiper.slideToLoop === "function") {
        signalSwiper.slideToLoop(Math.floor(slides.length / 2), 0);
      } else {
        slideTo(Math.floor(slides.length / 2), 0);
      }
    }
    window.setTimeout(centerMiddleSlide, 120);
    window.setTimeout(centerMiddleSlide, 900);

    swiperElement.addEventListener("click", function (event) {
      var slide = event.target.closest(".swiper-slide");
      if (!slide || slide.classList.contains("swiper-slide-active")) return;
      event.preventDefault();
      if (typeof signalSwiper.slideToLoop === "function" && slide.dataset.swiperSlideIndex) {
        signalSwiper.slideToLoop(Number(slide.dataset.swiperSlideIndex));
      } else {
        slideTo(Array.prototype.indexOf.call(slides, slide));
      }
    });

    swiperElement.dataset.swiperReady = "true";
  }

  function initHome() {
    if (document.documentElement.dataset.homeReady === "true") return;
    document.documentElement.dataset.homeReady = "true";
    try { initSignalStories(); } catch (error) { console.error("Nearloom component failed: signal stories", error); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHome);
  else initHome();
}());
