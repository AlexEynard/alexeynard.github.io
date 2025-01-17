//Pour l'interface du menu dépliant pour écran de téléphone
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menus = document.querySelectorAll('.menu, .menu-right');
  menuToggle.addEventListener('click', function () {
    menus.forEach(menu => menu.classList.toggle('show'));
  });
});



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



document.getElementById("valider").addEventListener("click", function (event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const questions = document.querySelectorAll(".q");
  let score = 0;
  const total = questions.length;

  questions.forEach((q) => {
    const correctAnswer = q.getAttribute("data-correct");
    const explication = q.getAttribute("data-explication");
    const userAnswer = q.querySelector("input[type='radio']:checked");
    const explanationDiv = q.querySelector(".explanation");

    // Réinitialiser la bordure avant de définir la couleur
    explanationDiv.style.border = "1px solid #ddd"; // Bordure neutre par défaut

    if (userAnswer) {
      if (userAnswer.value === correctAnswer) {
        score++;
        explanationDiv.innerHTML = "Bonne réponse !";
        explanationDiv.style.backgroundColor = "#c8e6c9"; // Vert clair
        explanationDiv.style.color = "#388e3c"; // Vert foncé
        explanationDiv.style.border = "1px solid #388e3c"; // Bordure verte
      } else {
        explanationDiv.innerHTML = `<strong>Mauvaise réponse</strong>. ${explication}`;
        explanationDiv.style.backgroundColor = "#fce4e4"; // Rouge clair
        explanationDiv.style.color = "#d32f2f"; // Rouge foncé
        explanationDiv.style.border = "1px solid #d32f2f"; // Bordure rouge
      }
    } else {
      explanationDiv.innerHTML = "Vous n'avez pas répondu à cette question.";
      explanationDiv.style.backgroundColor = "#fff3e0"; // Jaune clair
      explanationDiv.style.color = "#f57c00"; // Orange foncé
      explanationDiv.style.border = "1px solid #f57c00"; // Bordure orange
    }

    explanationDiv.style.fontSize = "1.1em";
    explanationDiv.style.display = "block";

    // Re-rendre le contenu LaTeX dans la correction
    MathJax.typesetPromise([explanationDiv]).catch((err) => console.error(err));
  });

  // Afficher le score final
  const resultatDiv = document.getElementById("resultat_qcm");
  const noteFinale = ((score / total) * 20).toFixed(1);
  resultatDiv.innerHTML = `<h3>Votre score : ${score}/${total} (${noteFinale}/20)</h3>`;

  resultatDiv.style.display = "block";

  // Re-rendre le contenu LaTeX dans le score final (si nécessaire)
  MathJax.typesetPromise([resultatDiv]).catch((err) => console.error(err));
});

