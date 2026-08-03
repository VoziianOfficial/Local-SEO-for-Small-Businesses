# Nearloom Local SEO website

Nearloom is a production-oriented, multi-page vanilla HTML, CSS, JavaScript, and PHP website for a local SEO studio serving small businesses. All website, metadata, accessibility, configuration, PHP response, and editor-facing content is written in English.

## Run locally

PHP is recommended because the contact endpoint is implemented in `contact.php`.

```sh
php -S 127.0.0.1:8008
```

Then open `http://127.0.0.1:8008/index.html`.

A simple static server can be used to review the pages, but form submission will not work without PHP and a configured mail transport.

## Edit temporary business data

Use only `config/config.js` to replace the current temporary values:

- brand and legal name;
- tagline and studio label;
- recipient and public contact email;
- postal address;
- navigation labels and destinations;
- CTA labels and destinations;
- form labels, messages, inquiry types, and service options;
- Advertise & Collaborate title and copy;
- footer headline, description, disclaimer, and copyright;
- legal links and legal-page update dates;
- service names, links, and descriptions.

The current brand name, legal name, email, postal address, and legal dates in the configuration are temporary and must be confirmed before launch.

No phone number is used anywhere in the project.

## Images

The site uses real files from `assets/images`. Every image slot includes an adjacent HTML comment with a recommended future filename. Add final licensed photographs to the existing `assets/images` directory, update the corresponding `src` values, and preserve meaningful `alt`, `width`, `height`, `loading`, and `decoding` attributes.

## Contact form

`contact.php` reads the JSON-compatible `window.SITE_CONFIG` object directly from `config/config.js`. It does not contain a fallback recipient, duplicated select options, or a hardcoded success message.

The endpoint:

- accepts POST form submissions only;
- enforces supported form content types and a 64 KB request limit;
- validates all required values, lengths, email, website, consent, and config-derived select options;
- rejects header injection and honeypot submissions;
- uses a short session-based rate limit;
- sends a plain-text email with a validated Reply-To address;
- returns JSON;
- reports a real server error when `mail()` fails.

Production hosting must provide a reliable PHP mail transport. Test successful and failed delivery on the final server. Consider replacing native `mail()` with an authenticated transactional provider only if the project architecture is formally updated.

## Local libraries

The project uses local, dependency-free builds for the required AOS-style reveals, Swiper-compatible sliders, and Lucide-style line icons. Initializers are guarded with `data-*` state so they cannot initialise the same component twice.

## Accessibility and motion

The website includes a skip link, semantic landmarks, visible keyboard focus, focus-trapped mobile navigation, Escape handling, accessible accordions, keyboard tabs, labelled sliders, associated form errors, live status messages, and reduced-motion alternatives. Essential page copy remains in HTML when JavaScript is unavailable.

## Legal review required

The Privacy Policy, Terms of Service, and Cookie Policy are practical drafts, not legal advice. A qualified legal professional must review them before production, after the final jurisdiction, hosting, email service, analytics, consent system, processors, retention periods, commercial terms, and transfer arrangements are known.

## Production checklist

- Replace all temporary configuration values.
- Replace the image placeholder with properly licensed photography.
- Confirm the canonical domain and Open Graph image URLs.
- Confirm final Organization structured data.
- Self-host or otherwise approve the chosen Manrope and Cormorant Garamond font files for the production environment.
- Configure and test email delivery, sender authentication, spam handling, and server sessions.
- Complete legal, privacy, cookie, accessibility, content, and security review.
- Test the complete site at 1440, 1280, 1024, 768, 430, 390, and 360 pixels.
- Re-run link, console, form, reduced-motion, and no-horizontal-overflow checks after final content and images are added.

## Design constraints

The visible UI uses only solid colours. No CSS, SVG, text, border, or mask gradients are used. The cold citron accent is intentionally restrained, and no fake rankings, reviews, testimonials, clients, awards, counters, performance figures, or guarantees are included.
