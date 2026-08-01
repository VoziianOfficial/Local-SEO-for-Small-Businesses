(function () {
  "use strict";
  function initMomentMosaic() {
    var mosaic = document.querySelector("[data-moment-mosaic]");
    if (!mosaic || mosaic.dataset.mosaicReady === "true") return;
    mosaic.dataset.mosaicReady = "true";
    var buttons = [].slice.call(mosaic.querySelectorAll("button"));
    buttons.forEach(function (button) { button.addEventListener("click", function () { buttons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); }); }); });
  }
  function initIndustries() { if (document.documentElement.dataset.industriesReady === "true") return; document.documentElement.dataset.industriesReady = "true"; try { initMomentMosaic(); } catch (error) { console.error("Nearloom component failed: local moments", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initIndustries); else initIndustries();
}());
