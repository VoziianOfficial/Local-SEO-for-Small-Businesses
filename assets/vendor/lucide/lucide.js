(function () {
  "use strict";
  var paths = {
    "arrow-up-right": '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "check": '<path d="m5 12 4 4L19 6"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "clipboard-list": '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M8 11h8"/><path d="M8 16h8"/><path d="M6 11h.01"/><path d="M6 16h.01"/>',
    "zap": '<path d="M13 2 3 14h8l-1 8 11-14h-8z"/>',
    "route": '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7H6.5a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>'
  };
  window.lucide = {
    createIcons: function () {
      document.querySelectorAll("[data-lucide]").forEach(function (node) {
        var name = node.getAttribute("data-lucide");
        if (!paths[name] || node.dataset.iconReady === "true") return;
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.8");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("aria-hidden", "true");
        svg.innerHTML = paths[name];
        node.replaceWith(svg);
      });
    }
  };
}());
