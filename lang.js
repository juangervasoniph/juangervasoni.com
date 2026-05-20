/**
 * lang.js — Language detection + manual switcher
 * Include this in BOTH index.html and es.html
 *
 * Logic:
 *  1. If user has manually picked a language (localStorage), respect it.
 *  2. Otherwise, detect browser language on first visit.
 *  3. Manual picker always overrides and saves preference.
 */

(function () {
  var STORAGE_KEY = 'jg_lang';
  var currentPage = window.location.pathname;
  var isSpanishPage = currentPage.endsWith('/es.html') || currentPage.endsWith('/es') || currentPage === '/es';
  var isEnglishPage = !isSpanishPage;

  function getPreferred() {
    // 1. Saved preference
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    // 2. Browser language detection
    var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (lang.startsWith('es')) return 'es';
    return 'en';
  }

  function autoRedirect() {
    // Only redirect on very first visit (no saved pref)
    if (localStorage.getItem(STORAGE_KEY)) return;
    var preferred = getPreferred();
    if (preferred === 'es' && isEnglishPage) {
      window.location.replace('es.html');
    }
    // Don't redirect away from Spanish if already there
  }

  function renderPicker() {
    var current = isSpanishPage ? 'es' : 'en';
    var picker = document.getElementById('lang-picker');
    if (!picker) return;

    picker.innerHTML =
      '<button id="lang-en" class="lang-btn' + (current === 'en' ? ' lang-active' : '') + '" aria-label="English">EN</button>' +
      '<span class="lang-sep">/</span>' +
      '<button id="lang-es" class="lang-btn' + (current === 'es' ? ' lang-active' : '') + '" aria-label="Español">ES</button>';

    document.getElementById('lang-en').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'en');
      if (isSpanishPage) window.location.href = 'index.html';
    });
    document.getElementById('lang-es').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'es');
      if (isEnglishPage) window.location.href = 'es.html';
    });
  }

  // Auto-redirect before page renders (only on first visit)
  autoRedirect();

  // Render picker once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPicker);
  } else {
    renderPicker();
  }
})();
