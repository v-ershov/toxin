// создаёт анимацию с помощью requestAnimationFrame
// https://javascript.info/js-animation#structured-animation
function animate({ duration, timing, draw }) {
  const start = performance.now();

  requestAnimationFrame(function step(time) {
    let timeFraction = (time - start) / duration;

    if (timeFraction > 1) {
      timeFraction = 1;
    }

    const progress = timing(timeFraction);

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(step);
    }
  });
}

// возвращает ширину вертикальной полосы прокрутки главного окна
function getScrollbarWidth() {
  return window.innerWidth - document.body.clientWidth;
}

export default {
  animate,
  getScrollbarWidth,
};
