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

  document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".service-switcher-compact");

    if (!section) return;

    const tabs = section.querySelectorAll(".service-switcher-compact__item");
    const panels = section.querySelectorAll(".service-switcher-compact__panel");

    const activatePanel = (targetId) => {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.target === targetId;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("mouseenter", () => {
        if (window.innerWidth > 991) {
          activatePanel(tab.dataset.target);
        }
      });

      tab.addEventListener("focus", () => {
        activatePanel(tab.dataset.target);
      });

      tab.addEventListener("click", () => {
        activatePanel(tab.dataset.target);
      });

      tab.addEventListener("keydown", (event) => {
        const tabsArray = Array.from(tabs);
        const currentIndex = tabsArray.indexOf(tab);
        let nextIndex = currentIndex;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabsArray.length;
          event.preventDefault();
        }

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
          event.preventDefault();
        }

        if (nextIndex !== currentIndex) {
          tabsArray[nextIndex].focus();
          activatePanel(tabsArray[nextIndex].dataset.target);
        }
      });
    });
  });
  function initAbout() {
    if (document.documentElement.dataset.aboutReady === "true") return;
    document.documentElement.dataset.aboutReady = "true";
    try { initAboutProcess(); } catch (error) { console.error("Nearloom component failed: about process", error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAbout); else initAbout();
}());
