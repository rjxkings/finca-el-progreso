// Menu, galeria, formulario y animaciones basicas

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initHeaderScroll();
  initMobileNav();
  initReveal();
  initGallery();
  initContactForm();
});

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    nav.classList.toggle("open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) closeNav();
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function initGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const filters = document.querySelectorAll(".filter-btn");
  const items = grid.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      items.forEach((item) => {
        const show = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  const openLightbox = (img, caption) => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = img.src.replace("w=800", "w=1400");
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = caption || img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.querySelector("figcaption")?.textContent || "";
      if (img) openLightbox(img, caption);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const success = document.getElementById("formSuccess");
  const fields = ["nombre", "correo", "asunto", "mensaje"];

  const validators = {
    nombre: (value) =>
      value.trim().length >= 3 ? "" : "Ingresa tu nombre (mínimo 3 caracteres).",
    correo: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ""
        : "Ingresa un correo electrónico válido.",
    asunto: (value) => (value ? "" : "Selecciona un asunto."),
    mensaje: (value) =>
      value.trim().length >= 10
        ? ""
        : "Escribe un mensaje de al menos 10 caracteres.",
  };

  const showError = (name, message) => {
    const input = form.elements.namedItem(name);
    const row = input?.closest(".form-row");
    const error = form.querySelector(`.field-error[data-for="${name}"]`);
    if (row) row.classList.toggle("is-invalid", Boolean(message));
    if (error) error.textContent = message;
  };

  fields.forEach((name) => {
    const input = form.elements.namedItem(name);
    input?.addEventListener("input", () => {
      const message = validators[name](input.value);
      showError(name, message);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;

    fields.forEach((name) => {
      const input = form.elements.namedItem(name);
      const message = validators[name](input.value);
      showError(name, message);
      if (message) valid = false;
    });

    if (!valid) return;

    form.reset();
    fields.forEach((name) => showError(name, ""));
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      window.setTimeout(() => {
        success.hidden = true;
      }, 5000);
    }
  });
}
