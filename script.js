const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const viewport = carousel.querySelector('.carousel-viewport');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = carousel.querySelector('.carousel-dots');
  const counter = carousel.querySelector('.carousel-count');
  const arrows = [...carousel.querySelectorAll('.carousel-arrow')];
  let activeIndex = 0;

  const dotButtons = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show image ${index + 1}`);
    dot.addEventListener('click', () => goTo(index));
    dots.append(dot);
    return dot;
  });

  function update(index) {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    counter.textContent = `${activeIndex + 1} / ${slides.length}`;
    dotButtons.forEach((dot, dotIndex) => {
      if (dotIndex === activeIndex) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function goTo(index) {
    const destination = (index + slides.length) % slides.length;
    viewport.scrollTo({
      left: destination * viewport.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    update(destination);
  }

  arrows.forEach(button => button.addEventListener('click', () => {
    goTo(activeIndex + Number(button.dataset.step));
  }));

  viewport.addEventListener('scroll', () => {
    if (viewport.clientWidth) update(Math.round(viewport.scrollLeft / viewport.clientWidth));
  }, { passive: true });

  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(activeIndex - 1); }
  });

  window.addEventListener('resize', () => goTo(activeIndex));
  update(0);
});
