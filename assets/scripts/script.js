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
    const allCorrections = document.querySelectorAll('.exercice-correction');

    toggleButtons.forEach(button => {
      button.addEventListener('click', function () {
        const correction = this.parentElement.nextElementSibling;

        // fermer toutes les autres corrections ouvertes
        allCorrections.forEach(otherCorrection => {
          if (otherCorrection !== correction && !otherCorrection.classList.contains('hidden')) {
            otherCorrection.classList.add('hidden');
            otherCorrection.style.display = 'none';
            otherCorrection.style.animation = '';
          }
        });

        // cahcer la correction
        correction.classList.toggle('hidden');

        // animation
        if (correction.classList.contains('hidden')) {
          correction.style.display = 'none';
          correction.style.animation = '';
        } else {
          correction.style.display = 'block';
          correction.style.animation = 'slideIn 0.3s ease-in-out forwards';
        }
      });
    });
  }
});