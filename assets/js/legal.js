(function () {
  "use strict";
  function initLegalNavigation() {
    var nav = document.querySelector("[data-legal-nav]");
    if (!nav || nav.dataset.legalReady === "true") return;
    nav.dataset.legalReady = "true";
    var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
    var sections = links.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!visible) return;
      links.forEach(function (link) { link.setAttribute("aria-current", String(link.getAttribute("href") === "#" + visible.target.id)); });
    }, { rootMargin: "-18% 0px -62% 0px", threshold: [0, .2, .5] });
    sections.forEach(function (section) { observer.observe(section); });
  }
  function initLegal() { if (document.documentElement.dataset.legalPageReady === "true") return; document.documentElement.dataset.legalPageReady = "true"; try { initLegalNavigation(); } catch (error) { console.error("Nearloom component failed: legal navigation", error); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initLegal); else initLegal();
}());
