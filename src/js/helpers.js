// возвращает ширину вертикальной полосы прокрутки главного окна
const getScrollbarWidth = () => window.innerWidth - document.body.clientWidth;

export default {
  getScrollbarWidth,
};
