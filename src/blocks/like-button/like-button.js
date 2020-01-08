(function likeButton() {
  // ---------------
  // ---VARIABLES---
  // ---------------

  let isClickable = true; // если true, то кнопка доступна для клика

  const classButton = 'like-button'; // основной класс кнопки
  const classButtonActive = `${classButton}--active`; // класс модификатора кнопки, обозначающий, что кнопка активна
  const classNumbers = `${classButton}__numbers`; // класс элемента кнопки, обозначающий контейнер для числовых значений

  const animTime = 300; // продолжительность анимации в миллисекундах

  // ---------------
  // ---FUNCTIONS---
  // ---------------

  // увеличивает значение кнопки на 1
  function increase(button) {
    isClickable = false;

    const elemNumbers = button.firstChild;
    const elemNumber = elemNumbers.firstChild;

    elemNumbers.innerHTML = '';

    elemNumbers.insertAdjacentHTML('afterbegin', elemNumber.outerHTML);
    elemNumber.innerHTML = parseInt(elemNumber.innerHTML, 10) + 1;
    elemNumbers.insertAdjacentHTML('afterbegin', elemNumber.outerHTML);

    const classIncrease = `${classNumbers}--increase`;
    const classAnimIncrease = `${classNumbers}--anim-increase`;

    elemNumbers.classList.add(classIncrease);

    setTimeout(() => {
      elemNumbers.classList.add(classAnimIncrease);
    }, 1);

    setTimeout(() => {
      elemNumbers.lastChild.remove();
      elemNumbers.classList.remove(classIncrease, classAnimIncrease);
      isClickable = true;
    }, animTime);
  }

  // уменьшает значение кнопки на 1
  function reduce(button) {
    isClickable = false;

    const elemNumbers = button.firstChild;
    const elemNumber = elemNumbers.firstChild;

    elemNumbers.innerHTML = '';

    elemNumbers.insertAdjacentHTML('beforeend', elemNumber.outerHTML);
    elemNumber.innerHTML = parseInt(elemNumber.innerHTML, 10) - 1;
    elemNumbers.insertAdjacentHTML('beforeend', elemNumber.outerHTML);

    const classAnimReduce = `${classNumbers}--anim-reduce`;

    setTimeout(() => {
      elemNumbers.classList.add(classAnimReduce);
    }, 1);

    setTimeout(() => {
      elemNumbers.firstChild.remove();
      elemNumbers.classList.remove(classAnimReduce);
      isClickable = true;
    }, animTime);
  }

  // ------------
  // ---EVENTS---
  // ------------

  // возникает при клике по кнопке
  document.querySelectorAll(`.${classButton}`).forEach((button) => {
    button.addEventListener('click', () => {
      if (isClickable) {
        if (button.classList.contains(classButtonActive)) {
          button.classList.remove(classButtonActive);
          reduce(button);
        } else {
          button.classList.add(classButtonActive);
          increase(button);
        }
      }
    });
  });
}());
