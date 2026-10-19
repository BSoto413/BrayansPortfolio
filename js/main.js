// Brayan Soto portfolio — shared site script
(function () {
  "use strict";

  // ---- Mobile navigation ----
  var hamburger = document.querySelector(".hamburger");
  var nav = document.querySelector(".main-nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.focus();
      }
    });
  }

  // ---- Placeholder for images that haven't been added yet ----
  // Any <img> whose file is missing is swapped for a labeled box
  // showing its alt text (e.g. "Replace: Western boss room").
  function showPlaceholder(img) {
    if (img.dataset.placeholder) return;
    img.dataset.placeholder = "1";
    var box = document.createElement("div");
    box.className = "img-placeholder";
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", img.alt || "Image coming soon");
    box.textContent = "Image coming soon" + (img.alt ? ": " + img.alt : "");
    img.replaceWith(box);
  }
  document.querySelectorAll("img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
      showPlaceholder(img);
    } else {
      img.addEventListener("error", function () { showPlaceholder(img); });
    }
  });


  // ---- Carousel ----
  document.querySelectorAll(".carousel").forEach(function (car) {
    var track = car.querySelector(".carousel-track");
    var slides = car.querySelectorAll(".carousel-slide");
    var thumbs = car.querySelectorAll(".carousel-thumb");
    var count = car.querySelector(".carousel-count");
    var i = 0, n = slides.length;
    function go(k) {
      i = (k + n) % n;
      track.style.transform = "translateX(" + (-100 * i) + "%)";
      slides.forEach(function (s, j) { s.setAttribute("aria-hidden", j === i ? "false" : "true"); });
      thumbs.forEach(function (t, j) { t.classList.toggle("active", j === i); });
      if (thumbs[i]) thumbs[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      if (count) count.textContent = (i + 1) + " / " + n;
      var next = slides[(i + 1) % n].querySelector("img");
      if (next) next.loading = "eager";
    }
    car.querySelector(".prev").addEventListener("click", function () { go(i - 1); });
    car.querySelector(".next").addEventListener("click", function () { go(i + 1); });
    thumbs.forEach(function (t, j) { t.addEventListener("click", function () { go(j); }); });
    car.tabIndex = 0;
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    });
    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
      x0 = null;
    });
  });


  // ---- Tabs (design decisions) ----
  document.querySelectorAll(".decisions").forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll(".dtab"));
    function pick(t, focus) {
      tabs.forEach(function (o) {
        var on = o === t, panel = document.getElementById(o.getAttribute("aria-controls"));
        o.classList.toggle("active", on);
        o.setAttribute("aria-selected", on ? "true" : "false");
        o.tabIndex = on ? 0 : -1;
        panel.hidden = !on;
        panel.classList.toggle("show", on);
        if (on) { var im = panel.querySelector("img"); if (im) im.loading = "eager"; }
      });
      if (focus) t.focus();
      t.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { pick(t); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") pick(tabs[(i + 1) % tabs.length], true);
        if (e.key === "ArrowLeft") pick(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
  });

  // ---- Gallery lightbox ----
  var gallery = document.querySelectorAll(".gallery-item img, img.zoomable, .carousel-slide img");
  if (gallery.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("aria-hidden", "true");
    var big = document.createElement("img");
    big.alt = "";
    box.appendChild(big);
    document.body.appendChild(box);

    var close = function () {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
    };
    gallery.forEach(function (img) {
      img.addEventListener("click", function () {
        if (img.dataset.placeholder) return;
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        box.classList.add("open");
        box.setAttribute("aria-hidden", "false");
      });
    });
    box.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  // ---- Scroll reveal ----
  var targets = document.querySelectorAll(
    ".project-card, .section-title, .role-block, .reflection-section, .gallery-item, .timeline li, .contact-card"
  );
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
