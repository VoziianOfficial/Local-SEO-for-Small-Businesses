(function () {
  "use strict";

  function initServiceVisuals() {
    document.querySelectorAll("[data-service-visual]").forEach(function (visual) {
      if (visual.dataset.visualReady === "true") return;
      visual.dataset.visualReady = "true";
      var controls = [].slice.call(visual.querySelectorAll("[data-visual-control]"));
      var panels = [].slice.call(visual.querySelectorAll("[data-visual-panel]"));
      function activate(control, focus) {
        var target = control.dataset.visualControl;
        controls.forEach(function (button) {
          var selected = button === control;
          button.setAttribute("aria-selected", String(selected));
          button.tabIndex = selected ? 0 : -1;
        });
        panels.forEach(function (panel) { panel.hidden = panel.id !== target; });
        if (focus) control.focus();
      }
      controls.forEach(function (control, index) {
        control.addEventListener("click", function () { activate(control, false); });
        control.addEventListener("keydown", function (event) {
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1) return;
          event.preventDefault();
          var next = index;
          if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % controls.length;
          if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + controls.length) % controls.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = controls.length - 1;
          activate(controls[next], true);
        });
      });
      var selected = controls.find(function (control) { return control.getAttribute("aria-selected") === "true"; }) || controls[0];
      if (selected) activate(selected, false);
    });
  }

  function initServiceDetail() {
    if (document.documentElement.dataset.serviceDetailReady === "true") return;
    document.documentElement.dataset.serviceDetailReady = "true";
    try { initServiceVisuals(); } catch (error) { console.error("Nearloom component failed: service visual", error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initServiceDetail); else initServiceDetail();
}());
