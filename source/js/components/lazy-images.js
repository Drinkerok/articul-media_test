const ioImages = new IntersectionObserver((entries, io) => {
  entries
    .filter((entry) => entry.isIntersecting)
    .forEach((entry) => {
      const imgEl = entry.target;
      const newImgEl = new Image();
      newImgEl.onload = () => {
        imgEl.src = newImgEl.src;
        if (imgEl.dataset.srcset) {
          imgEl.srcset = imgEl.dataset.srcset;
        }
      };
      newImgEl.src = imgEl.dataset.src;
      io.unobserve(imgEl);
    });
});

document.querySelectorAll('img.lazy').forEach((imgEl) => ioImages.observe(imgEl));
