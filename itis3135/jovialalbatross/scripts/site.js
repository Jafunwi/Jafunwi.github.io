// site.js - shared behavior for the Jovial Albatross Wind Tea Cart site

// Marks the nav link for the current page with aria-current="page".
// Returns true once the nav links exist, false if they have not loaded yet.
function markCurrentPage() {
  const links = document.querySelectorAll('nav a');
  if (links.length === 0) {
    return false;
  }
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (link) {
    if (link.getAttribute('href') === currentFile) {
      link.setAttribute('aria-current', 'page');
    }
  });
  return true;
}

// The nav is loaded by include.min.js after the page renders,
// so watch the document until the nav links appear, then stop watching.
if (!markCurrentPage()) {
  const watcher = new MutationObserver(function () {
    if (markCurrentPage()) {
      watcher.disconnect();
    }
  });
  watcher.observe(document.documentElement, { childList: true, subtree: true });
}