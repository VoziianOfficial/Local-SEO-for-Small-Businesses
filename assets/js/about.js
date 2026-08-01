(function () {
  "use strict";
  function initAboutProcess() {
    var marker = document.querySelector("[data-process-marker]");
    var stages = [].slice.call(document.querySelectorAll("[data-process-stage]"));
    if (!marker || !stages.length || marker.dataset.processReady === "true") return;
    marker.dataset.processReady = "true";
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) marker.textContent = entry.target.dataset.processStage; });
    }, { rootMargin: "-35% 0px -45% 0px", threshold: 0 });
    stages.forEach(function (stage) { observer.observe(stage); });
  }
  function initAbout() {
    if (document.documentElement.dataset.aboutReady === "true") return;
    document.documentElement.dataset.aboutReady = "true";
    try { initAboutProcess(); } catch (error) { console.error("Nearloom component failed: about process", error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAbout); else initAbout();
}());
