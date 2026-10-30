
/* ==========================================
   GRIDMIND YOUNG CODERS
   js/young-coders.js
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ========================================
     1. TYPEWRITER
     ======================================== */

  const typewriter = document.getElementById("yc-typewriter");

  const phrases = [
    "Websites bauen",
    "Spiele entwickeln",
    "Apps programmieren",
    "kreativ werden"
  ];

  if (typewriter) {
    if (reducedMotion) {
      typewriter.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = phrases[0].length;
      let deleting = true;

      function typeTick() {
        const current = Array.from(phrases[phraseIndex]);

        charIndex += deleting ? -1 : 1;

        charIndex = Math.max(
          0,
          Math.min(current.length, charIndex)
        );

        typewriter.textContent =
          current.slice(0, charIndex).join("");

        let delay = deleting ? 45 : 85;

        if (charIndex === 0 && deleting) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 350;
        } else if (charIndex === current.length && !deleting) {
          deleting = true;
          delay = 1800;
        }

        window.setTimeout(typeTick, delay);
      }

      window.setTimeout(typeTick, 1700);
    }
  }

  /* ========================================
     2. SELFCHECK
     Kein Eignungstest – nur Interessencheck
     ======================================== */

  const inputs = Array.from(
    document.querySelectorAll(".yc-selfcheck-input")
  );

  const result = document.getElementById("yc-check-result");
  const meter = document.getElementById("yc-check-meter-fill");

  function updateSelfcheck() {
    if (!result || !meter || !inputs.length) return;

    const selected = inputs.filter(input => input.checked).length;

    meter.style.width =
      (selected / inputs.length * 100) + "%";

    if (selected === 0) {
      result.textContent =
        "Wähle die Aussagen aus, die zu dir passen. " +
        "Es gibt keine falschen Antworten.";
    } else if (selected === 1) {
      result.textContent =
        "Du hast einen spannenden Ansatzpunkt gefunden. " +
        "Vielleicht macht dir ein kleines Code-Projekt Spaß!";
    } else if (selected === 2) {
      result.textContent =
        "Du bringst Neugier auf technische Ideen mit. " +
        "Probier doch eine erste Programmieraufgabe aus!";
    } else {
      result.textContent =
        "Viele dieser Themen interessieren dich! " +
        "Young Coders könnte eine spannende Möglichkeit " +
        "sein, Programmieren auszuprobieren.";
    }
  }

  inputs.forEach(input => {
    input.addEventListener("change", updateSelfcheck);
  });

  updateSelfcheck();

  /* ========================================
     3. MINI CODE LAB
     ======================================== */

  const colorButtons = Array.from(
    document.querySelectorAll("[data-yc-color]")
  );

  const demoButton = document.getElementById("yc-demo-button");
  const codeColor = document.getElementById("yc-code-color");

  colorButtons.forEach(button => {
    button.addEventListener("click", () => {
      const color = button.dataset.ycColor;

      if (!/^#[0-9a-fA-F]{6}$/.test(color)) return;

      if (demoButton) {
        demoButton.style.backgroundColor = color;
      }

      if (codeColor) {
        codeColor.textContent = color;
      }

      colorButtons.forEach(item => {
        item.setAttribute(
          "aria-pressed",
          String(item === button)
        );
      });
    });
  });

  /* ========================================
     4. ANIMATED ROADMAP
     ======================================== */

  const roadmap = document.querySelector(".yc-roadmap");
  const line = document.querySelector(".yc-roadmap-line");
  const progress = document.querySelector(".yc-roadmap-progress");

  const phases = Array.from(
    document.querySelectorAll(".yc-phase")
  );

  if (!roadmap || !line || !progress || !phases.length) return;

  if (reducedMotion) {
    phases.forEach(phase => {
      phase.classList.add("is-visible");
    });

    progress.style.height = "100%";
    return;
  }

  if ("IntersectionObserver" in window) {
    roadmap.classList.add("yc-roadmap-js");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -5% 0px"
    });

    phases.forEach(phase => observer.observe(phase));
  } else {
    phases.forEach(phase => {
      phase.classList.add("is-visible");
    });
  }

  let scheduled = false;

  function updateRoadmapProgress() {
    const rect = line.getBoundingClientRect();
    const trigger = window.innerHeight * 0.65;

    const amount = Math.max(
      0,
      Math.min(rect.height, trigger - rect.top)
    );

    progress.style.height = amount + "px";
    scheduled = false;
  }

  function requestRoadmapUpdate() {
    if (scheduled) return;

    scheduled = true;
    window.requestAnimationFrame(updateRoadmapProgress);
  }

  window.addEventListener("scroll", requestRoadmapUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestRoadmapUpdate);

  requestRoadmapUpdate();
});
