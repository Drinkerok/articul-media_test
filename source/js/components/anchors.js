// на список якорей обработчик
// при клике, отменяется стандартное поведение и скроллится до ссылки
document.querySelectorAll('.anchors').forEach((anchorsEl) => anchorsEl.addEventListener('click', (evt) => {
  const linkEl = evt.target.classList.contains('anchors__link')
    ? evt.target
    : evt.target.closest('.anchors__link');
  if (!linkEl) {
    return;
  }

  evt.preventDefault();
  const anchorName = linkEl.getAttribute('href').slice(1);
  const targetEl = document.querySelector(`#${anchorName}`);
  if (!targetEl) {
    return;
  }

  targetEl.scrollIntoView({
    block: 'start',
    behavior: 'smooth',
  });
}));

// при скролле подсвечивать нужную ссылку
const anchorsObserver = new IntersectionObserver((entries) => {
  const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
  if (intersectingEntries.length === 0) {
    return;
  }

  const lastEntry = intersectingEntries[intersectingEntries.length - 1];
  const anchorName = lastEntry.target.id;
  anchorLinkEls.forEach((el) => {
    if (el.getAttribute('href').slice(1) === anchorName) {
      el.classList.add('anchors__link--active');
    } else {
      el.classList.remove('anchors__link--active');
    }
  });
});


const anchorLinkEls = [...document.querySelectorAll('.anchors__link')];
anchorLinkEls
  .map((linkEl) => {
    const anchorName = linkEl.getAttribute('href').slice(1);
    return document.querySelector(`#${anchorName}`);
  })
  .filter((targetEl) => !!targetEl)
  .forEach((targetEl) => anchorsObserver.observe(targetEl));
