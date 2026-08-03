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
  function initIndustries() { if (document.documentElement.dataset.industriesReady === "true") return; document.documentElement.dataset.industriesReady = "true"; try { initMomentMosaic(); } catch (error) { console.error("Nearloom component failed: local moments", error); } try { initBusinessSwiper(); } catch (error) { console.error("Nearloom component failed: business swiper", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initIndustries); else initIndustries();
}());
