// Pour l'interface du menu dépliant pour écran de téléphone
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menus = document.querySelectorAll('.menu, .menu-right');

  if (!menuToggle || menus.length === 0) return; // Vérification des sélecteurs

  document.addEventListener('click', function (event) {
    const target = event.target;

    if (menuToggle.contains(target)) {
      // Basculer l'affichage du menu
      menus.forEach(menu => menu.classList.toggle('show'));
    } else if (!target.closest('.menu') && !target.closest('.menu-right')) {
      // Fermer le menu si on clique en dehors
      menus.forEach(menu => menu.classList.remove('show'));
    }
  });
});

// Chargement de MathJax en mode asynchrone avec préchargement
function loadMathJaxAsync() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML';
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    // Initialiser MathJax dès qu'il est chargé
    configureMathJax();
  };
}

// Configure MathJax avec des optimisations supplémentaires
function configureMathJax() {
  MathJax.Hub.Config({
    tex: {
      displayMath: ['\\[', '\\]'],
      inlineMath: ['\\(', '\\)'],
      processEscapes: true
    },
    options: {
      renderActions: {
        addMenu: [0, '', '']
      }
    },
    messageStyle: 'none', // Supprime les messages MathJax inutiles
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'], // Ignorer ces balises HTML
  });
}

// Fonction pour rendre MathJax de manière différée
function renderMathJax() {
  if (typeof MathJax !== 'undefined') {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
}

// Fonction de rendu paresseux pour le LaTeX dans la correction
function renderLatexInCorrections() {
  const explanationDivs = document.querySelectorAll('.explanation');

  explanationDivs.forEach(div => {
    // Utilisation de MathJax de manière différée et en petit nombre
    requestIdleCallback(() => {
      MathJax.typesetPromise([div]).catch((err) => console.error(err));
    });
  });
}

// Fonction de gestion des boutons pour ouvrir et fermer les corrections
document.addEventListener("DOMContentLoaded", function () {
  // Attente du chargement de MathJax avant d'initialiser
  loadMathJaxAsync();

  // Gestion des interactions avec les boutons de correction
  const toggleButtons = document.querySelectorAll('.toggle-correction');
  const allCorrections = document.querySelectorAll('.exercice-correction');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      const correction = this.parentElement.nextElementSibling;

      // Fermer toutes les autres corrections ouvertes
      allCorrections.forEach(otherCorrection => {
        if (otherCorrection !== correction && !otherCorrection.classList.contains('hidden')) {
          otherCorrection.classList.add('hidden');
          otherCorrection.style.display = 'none';
          otherCorrection.style.animation = '';
        }
      });

      // Afficher ou cacher la correction
      correction.classList.toggle('hidden');
      if (correction.classList.contains('hidden')) {
        correction.style.display = 'none';
        correction.style.animation = '';
      } else {
        correction.style.display = 'block';
        correction.style.animation = 'slideIn 0.3s ease-in-out forwards';
      }

      // Rendre MathJax dans la correction
      renderLatexInCorrections();
    });
  });

  // Quand le bouton de validation du QCM est cliqué
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

      // Réinitialiser les styles de la bordure
      explanationDiv.style.border = "1px solid #ddd";

      if (userAnswer) {
        if (userAnswer.value === correctAnswer) {
          score++;
          explanationDiv.innerHTML = "Bonne réponse !";
          explanationDiv.style.backgroundColor = "#c8e6c9";
          explanationDiv.style.color = "#388e3c";
          explanationDiv.style.border = "1px solid #388e3c";
        } else {
          explanationDiv.innerHTML = `<strong>Mauvaise réponse</strong>. ${explication}`;
          explanationDiv.style.backgroundColor = "#fce4e4";
          explanationDiv.style.color = "#d32f2f";
          explanationDiv.style.border = "1px solid #d32f2f";
        }
      } else {
        explanationDiv.innerHTML = "Vous n'avez pas répondu à cette question.";
        explanationDiv.style.backgroundColor = "#fff3e0";
        explanationDiv.style.color = "#f57c00";
        explanationDiv.style.border = "1px solid #f57c00";
      }

      explanationDiv.style.fontSize = "1.1em";
      explanationDiv.style.display = "block";

      // Rendre LaTeX dans la correction
      renderLatexInCorrections();
    });

    // Afficher le score final
    const resultatDiv = document.getElementById("resultat_qcm");
    const noteFinale = ((score / total) * 20).toFixed(1);
    resultatDiv.innerHTML = `<h3>Votre score : ${score}/${total} (${noteFinale}/20)</h3>`;
    resultatDiv.style.display = "block";

    // Rendre LaTeX dans le score final
    renderLatexInCorrections();
  });
});
