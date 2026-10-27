
/* ==========================================
   GRIDMIND – KI AUTOMATION
   js/automation.js
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(
    document.querySelectorAll("[data-role-tab]")
  );

  if (tabs.length === 0) return;

  function activateTab(index, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      const panelId = tab.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);

      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;

      if (panel) {
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      }
    });

    if (focus) {
      tabs[index].focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(index);
    });

    tab.addEventListener("keydown", (event) => {
      let next = index;

      if (event.key === "ArrowRight") {
        next = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        next = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(next, true);
    });
  });

  activateTab(0);
});
