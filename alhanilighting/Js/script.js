
/* ==============================
   ALHANI FOR LIGHTING
   GSAP + 3D Interactions
================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const heroCard = document.getElementById("heroImageCard");
  const galleryGrid = document.getElementById("galleryGrid");

  // Current year
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  // Mobile navigation
  function closeMenu() {
    navLinks.classList.remove("is-open");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");

    body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  // Stop videos when the page is left or another video starts
  const videos = document.querySelectorAll(".video-card video");

  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((otherVideo) => {
        if (otherVideo !== video) {
          otherVideo.pause();
        }
      });
    });
  });

  // 3D hero tilt
  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (heroCard && canHover) {
    const heroVisual = heroCard.parentElement;

    heroVisual.addEventListener("mousemove", (event) => {
      const rect = heroCard.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 10;

      heroCard.style.transition = "transform 0.12s ease-out";
      heroCard.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisual.addEventListener("mouseleave", () => {
      heroCard.style.transition =
        "transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)";
      heroCard.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }

  // 3D gallery tilt
  if (canHover) {
    document.querySelectorAll(".gallery-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 7;
        const rotateX = (0.5 - y) * 7;

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(800px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  // Image lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const galleryImages = Array.from(
    galleryGrid.querySelectorAll(".gallery-card img")
  );

  let currentImageIndex = 0;
  let previousFocus = null;

  function openLightbox(index) {
    currentImageIndex = index;
    previousFocus = document.activeElement;

    updateLightboxImage();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";

    lightboxClose.focus();
  }

  function updateLightboxImage() {
    const image = galleryImages[currentImageIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    body.style.overflow = "";

    lightboxImage.src = "";

    if (previousFocus) {
      previousFocus.focus();
    }
  }

  function showPreviousImage() {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) %
      galleryImages.length;

    updateLightboxImage();
  }

  function showNextImage() {
    currentImageIndex =
      (currentImageIndex + 1) % galleryImages.length;

    updateLightboxImage();
  }

  galleryImages.forEach((image, index) => {
    const button = image
      .closest(".gallery-card")
      .querySelector(".view-image");

    button.addEventListener("click", () => {
      openLightbox(index);
    });

    image.addEventListener("click", () => {
      openLightbox(index);
    });

    image.style.cursor = "pointer";
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPreviousImage);
  lightboxNext.addEventListener("click", showNextImage);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showNextImage();
    if (event.key === "ArrowRight") showPreviousImage();
  });

  // GSAP animations
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (window.gsap && window.ScrollTrigger && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from(".hero-item", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      stagger: 0.13,
      ease: "power3.out",
      delay: 0.15
    });

    gsap.from(".hero-visual", {
      opacity: 0,
      x: -45,
      scale: 0.94,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.25
    });

    // Floating hero decorations
    gsap.to(".tag-top", {
      y: -10,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".tag-bottom", {
      y: 9,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".orbit-one", {
      rotation: "+=8",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".orbit-two", {
      rotation: "+=12",
      duration: 13,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Reveal sections on scroll
    document.querySelectorAll(".reveal").forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 35
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        }
      );
    });

    // Gallery cards enter in sequence
    gsap.fromTo(
      ".gallery-card",
      {
        opacity: 0,
        y: 25
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gallery-grid",
          start: "top 82%",
          once: true
        }
      }
    );

  } else {
    // Fallback if GSAP is unavailable or reduced motion is enabled
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // Update gallery count using the actual image cards
  document.getElementById("galleryCount").textContent =
    String(galleryImages.length);

  console.log("Alhani For Lighting website is ready.");
});
