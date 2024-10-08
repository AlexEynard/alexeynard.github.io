//Pour l'interface du menu dépliant pour écran de téléphone
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menus = document.querySelectorAll('.menu, .menu-right');

  menuToggle.addEventListener('click', function () {
    menus.forEach(menu => menu.classList.toggle('show'));
  });
});


//Affichage de la correction d'un exercice
document.addEventListener("DOMContentLoaded", function () {
  function waitForMathJax() {
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
      MathJax.typesetPromise().then(() => {
        initialize();
      });
    } else {
      setTimeout(waitForMathJax, 50);
    }
  }

  waitForMathJax();

  function initialize() {
    const toggleButtons = document.querySelectorAll('.toggle-correction');
    toggleButtons.forEach(button => {
      button.addEventListener('click', toggleCorrectionVisibility);
    });

    function toggleCorrectionVisibility() {
      const correction = this.parentElement.nextElementSibling;
      correction.classList.toggle('hidden');
      correction.style.display = correction.classList.contains('hidden') ? 'none' : 'block';
      correction.style.animation = correction.classList.contains('hidden') ? '' : 'slideIn 0.5s forwards';
    }
  }
});
