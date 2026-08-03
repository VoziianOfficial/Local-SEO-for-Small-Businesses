(function () {
  "use strict";

	  function getValue(source, path) {
	    return path.split(".").reduce(function (value, key) {
	      return value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined;
	    }, source);
	  }

	  function interpolate(value, config) {
	    if (typeof value !== "string") return value;
	    var replacements = {
	      "{brandName}": config.brand && config.brand.name,
	      "{legalName}": config.brand && config.brand.legalName,
	      "{email}": config.contact && config.contact.recipientEmail,
	      "{address}": config.contact && config.contact.address
	    };
	    Object.keys(replacements).forEach(function (token) {
	      if (typeof replacements[token] === "string") value = value.split(token).join(replacements[token]);
	    });
	    return value;
	  }

	  function renderText(config) {
	    document.querySelectorAll("[data-config]").forEach(function (element) {
	      var value = interpolate(getValue(config, element.dataset.config), config);
	      if (typeof value === "string") element.textContent = value;
	    });
	  }

  function renderAttributes(config) {
    document.querySelectorAll("[data-config-href]").forEach(function (element) {
      var value = getValue(config, element.dataset.configHref);
      if (typeof value === "string") element.setAttribute("href", value);
    });
    var favicon = document.querySelector('link[rel="icon"]');
    if (favicon && config.brand && config.brand.favicon) favicon.href = config.brand.favicon;
  }

	  function renderEmail(config) {
	    document.querySelectorAll("[data-config-email]").forEach(function (element) {
	      element.textContent = config.contact.recipientEmail;
	      if (element.tagName === "A") element.href = "mailto:" + config.contact.recipientEmail;
	    });
	  }

	  function buildGlobalReplacements(config) {
	    var legacy = config.legacy || {};
	    return [
	      [legacy.legalName || "Nearloom Local Ltd.", config.brand.legalName],
	      [legacy.brandName || "Nearloom", config.brand.name],
	      [legacy.email || "hello@nearloomlocal.com", config.contact.recipientEmail],
	      [legacy.address || "24 Meridian Court, Leeds, LS1 4AB, United Kingdom", config.contact.address]
	    ].filter(function (pair) {
	      return typeof pair[0] === "string" && typeof pair[1] === "string" && pair[0] && pair[0] !== pair[1];
	    }).sort(function (a, b) {
	      return b[0].length - a[0].length;
	    });
	  }

	  function replaceConfiguredValues(value, replacements) {
	    if (typeof value !== "string" || !value) return value;
	    replacements.forEach(function (pair) {
	      value = value.split(pair[0]).join(pair[1]);
	    });
	    return value;
	  }

	  function renderGlobalBrandReferences(config) {
	    var replacements = buildGlobalReplacements(config);
	    if (!replacements.length) return;

	    document.title = replaceConfiguredValues(document.title, replacements);
	    document.querySelectorAll("meta[content], [aria-label], [title], [alt], [placeholder]").forEach(function (element) {
	      ["content", "aria-label", "title", "alt", "placeholder"].forEach(function (attribute) {
	        if (!element.hasAttribute(attribute)) return;
	        var current = element.getAttribute(attribute);
	        var next = replaceConfiguredValues(current, replacements);
	        if (next !== current) element.setAttribute(attribute, next);
	      });
	    });

	    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
	      acceptNode: function (node) {
	        var parent = node.parentElement;
	        if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|SELECT|OPTION)$/i.test(parent.tagName)) {
	          return NodeFilter.FILTER_REJECT;
	        }
	        return NodeFilter.FILTER_ACCEPT;
	      }
	    });
	    var node;
	    while ((node = walker.nextNode())) {
	      var updated = replaceConfiguredValues(node.nodeValue, replacements);
	      if (updated !== node.nodeValue) node.nodeValue = updated;
	    }
	  }

  function renderNavigation(config) {
    var current = document.body.dataset.navSection || window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-index]").forEach(function (link) {
      var item = config.navigation.items[Number(link.dataset.navIndex)];
      if (!item) return;
      link.textContent = item.label;
      link.href = item.href;
      if (item.href === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function renderStructuredData(config) {
    var script = document.querySelector("[data-organization-json]");
	    if (!script) return;
	    var canonicalOrigin = config.site && config.site.canonicalOrigin ? config.site.canonicalOrigin : "https://nearloomlocal.com/";
    var organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": config.brand.legalName,
      "alternateName": config.brand.name,
      "url": canonicalOrigin,
      "logo": new URL(config.brand.logoDark, canonicalOrigin).href,
      "email": config.contact.recipientEmail,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": config.contact.address
      },
      "description": config.brand.tagline
    };
    script.textContent = JSON.stringify(organization);
  }

  function renderServices(config) {
    document.querySelectorAll("[data-service-index]").forEach(function (link) {
      var service = config.services[Number(link.dataset.serviceIndex)];
      if (!service) return;
      link.textContent = service.name;
      link.href = service.href;
    });
  }

  function renderLegal(config) {
    document.querySelectorAll("[data-legal-index]").forEach(function (link) {
      var item = config.legal.links[Number(link.dataset.legalIndex)];
      if (!item) return;
      link.textContent = item.label;
      link.href = item.href;
    });
  }

  function renderSelect(select, values, placeholder) {
    if (!select || !Array.isArray(values)) return;
    var selected = select.value;
    select.innerHTML = "";
    var first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
    if (values.indexOf(selected) !== -1) select.value = selected;
  }

  function renderForm(config) {
    renderSelect(document.querySelector("[data-inquiry-select]"), config.forms.inquiryTypes, "Select an inquiry type");
    renderSelect(document.querySelector("[data-service-select]"), config.forms.serviceOptions, "Select a service");
	    var consent = document.querySelector("[data-config-consent]");
	    if (consent) consent.textContent = interpolate(config.forms.privacyLabel, config);
	  }

  function initConfigRender() {
    var config = window.SITE_CONFIG;
    if (!config || document.documentElement.dataset.configReady === "true") return;
    document.documentElement.dataset.configReady = "true";
    renderText(config);
    renderAttributes(config);
    renderEmail(config);
    renderNavigation(config);
	    renderServices(config);
	    renderLegal(config);
	    renderForm(config);
	    renderGlobalBrandReferences(config);
	    renderStructuredData(config);
    document.dispatchEvent(new CustomEvent("nearloom:config-ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initConfigRender);
  else initConfigRender();
}());
