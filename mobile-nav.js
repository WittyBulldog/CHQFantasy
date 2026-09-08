document.querySelectorAll('.nav').forEach((nav) => {
  const toggle = nav.querySelector('.nav-toggle');
  const links = nav.querySelector('.navlinks');
  if (!toggle || !links) return;

  const mobile = window.matchMedia('(max-width:900px)');
  const setOpen = (open, restoreFocus = false) => {
    nav.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    if (restoreFocus) toggle.focus();
  };

  nav.classList.add('nav-enhanced');
  toggle.hidden = false;
  links.querySelector('.active-nav')?.setAttribute('aria-current', 'page');
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches && nav.classList.contains('nav-open')) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  links.addEventListener('click', (event) => {
    if (event.target.closest('a') && mobile.matches) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (mobile.matches && !nav.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusWasInLinks = links.contains(document.activeElement);
    setOpen(false, mobile.matches && focusWasInLinks);
  });
});
