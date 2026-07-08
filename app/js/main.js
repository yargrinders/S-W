(() => {
  const app            = document.querySelector('.app');
  const sidebarToggle  = document.querySelector('#sidebarToggle');
  const mobileBurger   = document.querySelector('#mobileBurger');
  const backdrop       = document.querySelector('#backdrop');
  const themeToggle    = document.querySelector('#themeToggle');
  const navLinks       = document.querySelectorAll('.nav__link');

  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

  const setSidebar = (state) => {
    app.dataset.sidebar = state;
    const collapsed = state === 'closed';
    sidebarToggle?.setAttribute('aria-expanded', String(!collapsed));
    const icon = sidebarToggle?.querySelector('i');
    if (icon) {
      icon.className = collapsed
        ? 'ti ti-layout-sidebar-left-expand'
        : 'ti ti-layout-sidebar-left-collapse';
    }
  };

  const syncSidebar = () => {
    setSidebar(isMobile() ? 'closed' : (localStorage.getItem('sw-sidebar') || 'open'));
  };

  const toggleSidebar = () => {
    const next = app.dataset.sidebar === 'open' ? 'closed' : 'open';
    setSidebar(next);
    if (!isMobile()) localStorage.setItem('sw-sidebar', next);
  };

  sidebarToggle?.addEventListener('click', toggleSidebar);
  mobileBurger?.addEventListener('click', () => setSidebar('open'));
  backdrop?.addEventListener('click', () => setSidebar('closed'));

  // Highlight current nav link
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
    if (isMobile()) {
      link.addEventListener('click', () => setSidebar('closed'));
    }
  });

  const setThemeIcon = () => {
    const icon = themeToggle?.querySelector('i');
    if (!icon) return;
    icon.className = document.documentElement.dataset.theme === 'dark' ? 'ti ti-moon' : 'ti ti-sun';
  };

  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('sw-theme', next);
    setThemeIcon();
  });

  // Init
  document.documentElement.dataset.theme = localStorage.getItem('sw-theme') || 'dark';
  setThemeIcon();
  syncSidebar();
  window.addEventListener('resize', syncSidebar);
})();