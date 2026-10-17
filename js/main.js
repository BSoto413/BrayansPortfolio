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

  // ---- Gallery lightbox ----
  var gallery = document.querySelectorAll(".gallery-item img");
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
