(function accordionF() {
  // ---------------
  // ---VARIABLES---
  // ---------------

  const classButton = 'accordion'; // основной класс аккордеона
  const classInput = `${classButton}__input`; // класс элемента аккордеона, обозначающий чекбокс
  const classContent = `${classButton}__content`; // класс элемента аккордеона, обозначающий контейнер для контента

  // ---------------
  // ---FUNCTIONS---
  // ---------------

  // изменяет значение свойства max-height у контейнера для контента
  function changeMaxHeight(accordion) {
    const input = accordion.querySelector(`.${classInput}`);
    const content = accordion.querySelector(`.${classContent}`);

    if (input.checked === true) {
      content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
      content.style.maxHeight = '0';
    }
  }

  // ------------
  // ---EVENTS---
  // ------------

  // возникает при клике по аккордеону
  document.querySelectorAll(`.${classButton}`).forEach((accordion) => {
    accordion.addEventListener('click', () => {
      changeMaxHeight(accordion);
    });
  });
}());
