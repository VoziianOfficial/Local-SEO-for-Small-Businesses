(function () {
  "use strict";
  function initMomentMosaic() {
    var mosaic = document.querySelector("[data-moment-mosaic]");
    if (!mosaic || mosaic.dataset.mosaicReady === "true") return;
    mosaic.dataset.mosaicReady = "true";
    var buttons = [].slice.call(mosaic.querySelectorAll("button"));
    buttons.forEach(function (button) { button.addEventListener("click", function () { buttons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); }); }); });
  }
  function initBusinessSwiper() {
    var element = document.querySelector("[data-business-swiper]");
    if (!element || typeof Swiper === "undefined" || element.dataset.swiperReady === "true") return;
    element.dataset.swiperReady = "true";
    new Swiper(element, {
      direction: "vertical",
      loop: true,
      speed: 1000,
      effect: "slide",
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: true,
      touchEventsTarget: "container",
      threshold: 3,
      touchRatio: 1,
      observer: true,
      observeParents: true,
      pagination: {
        el: ".business-swiper__pagination",
        clickable: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      a11y: {
        enabled: true
      }
    });
  }
  function initWorkShowcase() {
    var element = document.querySelector("[data-work-swiper]");
    if (!element || typeof Swiper === "undefined" || element.dataset.swiperReady === "true") return;
    element.dataset.swiperReady = "true";
    var workSwiper = new Swiper(element, {
      loop: true,
      speed: 750,
      spaceBetween: 18,
      slidesPerView: 1,
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: true,
      touchEventsTarget: "container",
      watchOverflow: false,
      loopAdditionalSlides: 2,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: 2200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      navigation: {
        nextEl: ".work-showcase__arrow--next",
        prevEl: ".work-showcase__arrow--prev"
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      a11y: {
        enabled: true
      },
      breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 18 },
        560: { slidesPerView: 1, spaceBetween: 18 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 22 },
        1280: { slidesPerView: 3, spaceBetween: 24 }
      }
    });
    if (workSwiper.autoplay && typeof workSwiper.autoplay.start === "function") workSwiper.autoplay.start();
  }
  function initIndustries() { if (document.documentElement.dataset.industriesReady === "true") return; document.documentElement.dataset.industriesReady = "true"; try { initMomentMosaic(); } catch (error) { console.error("Nearloom component failed: local moments", error); } try { initBusinessSwiper(); } catch (error) { console.error("Nearloom component failed: business swiper", error); } try { initWorkShowcase(); } catch (error) { console.error("Nearloom component failed: work showcase", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initIndustries); else initIndustries();
}());
