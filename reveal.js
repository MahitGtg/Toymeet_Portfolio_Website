/* Hard Cut — scroll-reveal system (plain JS, no JSX).
   Loaded as the LAST text/babel script, after App.jsx, so it runs once
   React has rendered. Still defensive: it retries until the DOM tree
   exists, since babel transpilation/render timing is not guaranteed. */
(function () {
  "use strict";

  // Section/row-level targets ONLY. Never observe individual .tmk-short
  // carousel cards — off-screen-horizontally cards never intersect and
  // would stay hidden forever. The whole .tmk-carousel reveals as one.
  // NOTE: .tmk-carousel reveals itself from inside React (Work.jsx). It is a
  // React-controlled node whose className is rewritten on every re-render, so
  // an imperatively-added "is-in" here would be clobbered. Do not list it.
  var SELECTOR = [
    ".tmk-sec-head",
    ".tmk-work__sub",
    ".tmk-work__prev",
    ".tmk-prev",
    ".tmk-about__col",
    ".tmk-contact__head",
    ".tmk-contact__details"
  ].join(",");

  var REDUCED =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealAll(nodes) {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-in");
  }

  function attach() {
    var nodes = document.querySelectorAll(SELECTOR);
    if (!nodes.length) return false; // not rendered yet

    // Reduced motion: show everything immediately, no observer.
    if (REDUCED || !("IntersectionObserver" in window)) {
      revealAll(nodes);
      return true;
    }

    var io = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target); // reveal once
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    for (var i = 0; i < nodes.length; i++) io.observe(nodes[i]);
    return true;
  }

  // Run on the next frame; retry a handful of times until React's tree
  // exists. Fall back to a MutationObserver on #root if it's still empty.
  function boot() {
    var attempts = 0;
    var MAX = 30;

    function tick() {
      if (attach()) return;
      attempts++;
      if (attempts < MAX) {
        requestAnimationFrame(tick);
        return;
      }
      // Last resort: watch #root for the tree to appear.
      var root = document.getElementById("root");
      if (root && "MutationObserver" in window) {
        var mo = new MutationObserver(function () {
          if (attach()) mo.disconnect();
        });
        mo.observe(root, { childList: true, subtree: true });
      }
    }

    requestAnimationFrame(tick);
  }

  boot();

  /* ---- top scroll-progress bar ---- */
  (function progress() {
    var bar = document.querySelector(".tmk-scrollbar i");
    if (!bar) return;
    var ticking = false;
    function paint() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.setProperty("--p", p.toFixed(2) + "%");
    }
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(paint);
      },
      { passive: true }
    );
    paint();
  })();
})();
