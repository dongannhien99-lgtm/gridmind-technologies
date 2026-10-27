
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // HEADER: HAMBURGER
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const header = document.getElementById("site-header");

  function setMobileMenu(open) {
    if (!hamburger || !mobileMenu) return;

    hamburger.classList.toggle("active", open);
    mobileMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);

    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute(
      "aria-label",
      open ? "Menü schließen" : "Menü öffnen"
    );

    mobileMenu.inert = !open;
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      setMobileMenu(!mobileMenu.classList.contains("open"));
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setMobileMenu(false));
    });

    document.addEventListener("click", event => {
      if (
        mobileMenu.classList.contains("open") &&
        !header.contains(event.target)
      ) {
        setMobileMenu(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 950) setMobileMenu(false);
    });
  }

  // DESKTOP NAVIGATION
  const navGroups = document.querySelectorAll(".nav-group");

  function closeDropdowns() {
    navGroups.forEach(group => {
      group.classList.remove("open");
      const trigger = group.querySelector(".nav-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  navGroups.forEach(group => {
    const trigger = group.querySelector(".nav-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", event => {
      event.stopPropagation();
      const shouldOpen = !group.classList.contains("open");
      closeDropdowns();

      group.classList.toggle("open", shouldOpen);
      trigger.setAttribute("aria-expanded", String(shouldOpen));
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".nav-group")) closeDropdowns();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeDropdowns();
      setMobileMenu(false);
    }
  });

  // INTERAKTIVE ANGEBOTSKARTEN
  const offerTabs = [...document.querySelectorAll(".offer-tab")];
  const offerPanels = [...document.querySelectorAll(".offer-panel")];

  function activateOffer(index) {
    offerTabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    offerPanels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  }

  offerTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateOffer(index));

    tab.addEventListener("keydown", event => {
      let nextIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % offerTabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + offerTabs.length) % offerTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = offerTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateOffer(nextIndex);
      offerTabs[nextIndex].focus();
    });
  });

  activateOffer(0);

  // COOKIE-EINWILLIGUNG
  const consentKey = "gridmind_cookie_consent_v1";

  const cookieOverlay = document.getElementById("cookie-overlay");
  const cookieBanner = document.getElementById("cookie-banner");
  const cookieDetails = document.getElementById("cookie-details");

  const cookieAccept = document.getElementById("cookie-accept");
  const cookieReject = document.getElementById("cookie-reject");
  const cookieSettings = document.getElementById("cookie-settings");
  const cookieSave = document.getElementById("cookie-save");

  const functional = document.getElementById("consent-functional");
  const analytics = document.getElementById("consent-analytics");
  const marketing = document.getElementById("consent-marketing");

  const defaultConsent = {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  };

  let lastFocusedElement = null;

  function readConsent() {
    try {
      const saved = JSON.parse(localStorage.getItem(consentKey));

      if (!saved || typeof saved !== "object") return null;

      if (
        typeof saved.functional !== "boolean" ||
        typeof saved.analytics !== "boolean" ||
        typeof saved.marketing !== "boolean"
      ) {
        return null;
      }

      return {
        necessary: true,
        functional: saved.functional,
        analytics: saved.analytics,
        marketing: saved.marketing
      };
    } catch {
      return null;
    }
  }

  function applyConsent(consent) {
    // Drittanbieterdienste müssen dieses Ereignis beachten.
    // In dieser ersten Version werden keine Analyse- oder
    // Marketingdienste geladen.
    document.dispatchEvent(new CustomEvent("gridmind:consent", {
      detail: { ...consent }
    }));
  }

  function showCookieBanner() {
    lastFocusedElement = document.activeElement;

    const saved = readConsent();
    const values = saved || defaultConsent;

    functional.checked = values.functional;
    analytics.checked = values.analytics;
    marketing.checked = values.marketing;

    cookieDetails.hidden = true;
    cookieSave.hidden = true;
    cookieSettings.hidden = false;

    cookieOverlay.hidden = false;
    cookieBanner.hidden = false;
    cookieBanner.focus();
  }

  function hideCookieBanner() {
    cookieOverlay.hidden = true;
    cookieBanner.hidden = true;

    if (lastFocusedElement && lastFocusedElement.isConnected) {
      lastFocusedElement.focus();
    }
  }

  function saveConsent(consent) {
    const normalized = {
      necessary: true,
      functional: consent.functional === true,
      analytics: consent.analytics === true,
      marketing: consent.marketing === true
    };

    try {
      localStorage.setItem(consentKey, JSON.stringify(normalized));
    } catch {
      // Bei gesperrtem Speicher wird die Entscheidung
      // nur für die aktuelle Seite angewendet.
    }

    applyConsent(normalized);
    hideCookieBanner();
  }

  cookieAccept.addEventListener("click", () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
  });

  cookieReject.addEventListener("click", () => {
    saveConsent(defaultConsent);
  });

  cookieSettings.addEventListener("click", () => {
    cookieDetails.hidden = false;
    cookieSave.hidden = false;
    cookieSettings.hidden = true;
  });

  cookieSave.addEventListener("click", () => {
    saveConsent({
      necessary: true,
      functional: functional.checked,
      analytics: analytics.checked,
      marketing: marketing.checked
    });
  });

  // Einstellungen aus dem Footer erneut öffnen
  document.querySelectorAll("[data-open-cookie]").forEach(button => {
    button.addEventListener("click", showCookieBanner);
  });

  // Beim ersten Seitenbesuch Auswahl verlangen
  const existingConsent = readConsent();

  if (existingConsent) {
    applyConsent(existingConsent);
  } else {
    showCookieBanner();
  }

  // Dialog-Fokus innerhalb des Cookie-Dialogs halten
  document.addEventListener("keydown", event => {
    if (cookieBanner.hidden || event.key !== "Tab") return;

    const focusable = [...cookieBanner.querySelectorAll(
      'button:not([hidden]):not(:disabled), a[href], input:not(:disabled)'
    )].filter(element =>
      !element.closest("[hidden]")
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

// ========================================
// GRIDMIND HERO – ANIMATION STARTEN
// ========================================

const heroStage = document.querySelector(".hero-stage");

if (heroStage) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    heroStage.classList.add("gm-floating");
  } else {
    const startHero = () => {
      heroStage.classList.add("gm-enter");

      // Sobald die längste Eingangsanimation fertig ist,
      // zur dauerhaft schwebenden Animation wechseln.
      window.setTimeout(() => {
        heroStage.classList.remove("gm-enter");
        heroStage.classList.add("gm-floating");
      }, 1800);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(startHero);
    });
  }
}

});


/* ==========================================
   GRIDMIND – LEARNING ROADMAP ANIMATION
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const roadmap = document.querySelector(".gm-roadmap");
  if (!roadmap) return;

  const track = roadmap.querySelector(".gm-roadmap-track");
  const line = roadmap.querySelector(".gm-roadmap-line");
  const progress = roadmap.querySelector(".gm-roadmap-line-progress");
  const phases = [...roadmap.querySelectorAll("[data-roadmap-phase]")];

  if (!track || !line || !progress || !phases.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    phases.forEach(phase => phase.classList.add("is-visible"));
    progress.style.height = "100%";
    return;
  }

  if (!("IntersectionObserver" in window)) {
    phases.forEach(phase => phase.classList.add("is-visible"));
  } else {
    roadmap.classList.add("gm-js-enabled");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -5% 0px"
    });

    phases.forEach(phase => observer.observe(phase));
  }

  let ticking = false;

  function updateRoadmapProgress() {
    const rect = line.getBoundingClientRect();

    // Die Animation wächst bis 65% der Bildschirmhöhe.
    const triggerY = window.innerHeight * 0.65;

    const visibleLength = triggerY - rect.top;
    const progressLength = Math.max(
      0,
      Math.min(rect.height, visibleLength)
    );

    progress.style.height = progressLength + "px";
    ticking = false;
  }

  function requestProgressUpdate() {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(updateRoadmapProgress);
  }

  window.addEventListener("scroll", requestProgressUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestProgressUpdate);

  requestProgressUpdate();
});
