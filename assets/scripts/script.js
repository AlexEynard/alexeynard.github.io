document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  if (!menuToggle || !menu) {
    console.warn("Menu mobile désactivé : Bouton de bascule ('.menu-toggle') ou menu ('.menu') introuvable dans le DOM.");
    return;
  }

  menuToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    const menuEstVisible = menu.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', menuEstVisible.toString());
  });

  document.addEventListener('click', function (event) {
    const estClicDehorsMenu = !event.target.closest('.menu') && !menuToggle.contains(event.target);
    if (estClicDehorsMenu) {
      menu.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

function loadMathJaxAsync() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  script.async = true;
  document.head.appendChild(script);

  script.onload = function () {
    configureMathJax();
  };

  script.onerror = function () {
    console.error("Erreur de chargement de MathJax. Veuillez vérifier votre connexion internet ou la CDN.");
  };
}

function configureMathJax() {
  if (typeof MathJax !== 'undefined') {
    MathJax.startup.defaultReady();
    MathJax.config({
      tex: {
        displayMath: [['\\[', '\\]']],
        inlineMath: [['\\(', '\\)']],
        processEscapes: true
      },
      options: {
        renderActions: {
          addMenu: [0, '', '']
        }
      },
      messageStyle: 'none',
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    });
    MathJax.startup.document.inputJax[0].preProcess();
  }
}


function renderMathJax() {
  if (typeof MathJax !== 'undefined') {
    MathJax.typesetPromise()
      .catch(function (err) {
        console.error('Typeset failed: ' + err.message);
      });
  }
}

function renderLatexInCorrections() {
  const explanationDivs = document.querySelectorAll('.explanation');

  for (let i = 0; i < explanationDivs.length; i++) {
    const div = explanationDivs[i];
    if (div.textContent.trim()) {
      MathJax.typesetPromise([div]).catch(function (err) {
        console.error("MathJax typeset error:", err);
      });
    }
  }
}

function applyNeutralExplanationStyle(explanationDiv) {
  explanationDiv.style.border = "1px solid var(--grey-ddd)";
  explanationDiv.style.backgroundColor = '';
  explanationDiv.style.color = '';
  explanationDiv.style.borderColor = '';
}

function applyCorrectExplanationStyle(explanationDiv) {
  explanationDiv.innerHTML = "<strong>Bonne réponse !</strong>";
  explanationDiv.style.backgroundColor = "var(--correct-light)";
  explanationDiv.style.color = "var(--correct)";
  explanationDiv.style.border = "1px solid var(--correct)";
}

function applyIncorrectExplanationStyle(explanationDiv, explication, correctAnswersText) {
  explanationDiv.innerHTML = `<strong>Mauvaise réponse. La bonne réponse était : ${correctAnswersText}.</strong><br> ${explication}`;
  explanationDiv.style.backgroundColor = "var(--false-light)";
  explanationDiv.style.color = "var(--false)";
  explanationDiv.style.border = "1px solid var(--false)";
}

function applyWarningExplanationStyle(explanationDiv) {
  explanationDiv.innerHTML = "Vous n'avez pas répondu à cette question.";
  explanationDiv.style.backgroundColor = "var(--warning-light)";
  explanationDiv.style.color = "var(--warning)";
  explanationDiv.style.border = "1px solid var(--warning)";
}


document.addEventListener("DOMContentLoaded", function () {
  loadMathJaxAsync();

  const toggleButtons = document.querySelectorAll('.toggle-correction');
  const allCorrections = document.querySelectorAll('.exercice-correction');

  for (let i = 0; i < toggleButtons.length; i++) {
    const button = toggleButtons[i];
    button.addEventListener('click', function () {
      const correction = this.parentElement.nextElementSibling;

      for (let j = 0; j < allCorrections.length; j++) {
        const otherCorrection = allCorrections[j];
        if (otherCorrection !== correction && !otherCorrection.classList.contains('hidden')) {
          otherCorrection.classList.add('hidden');
          otherCorrection.style.display = 'none';
          otherCorrection.style.animation = '';
        }
      }

      const estCache = correction.classList.toggle('hidden');
      correction.style.display = estCache ? 'none' : 'block';
      correction.style.animation = estCache ? '' : 'slideIn 0.3s ease-in-out forwards';

      renderLatexInCorrections();
    });
  }


  const validerButton = document.getElementById("valider");
  const questions = document.querySelectorAll(".q");
  const resultatDiv = document.getElementById("resultat_qcm");

  if (validerButton) {
    validerButton.addEventListener('click', function (event) {
      event.preventDefault();
      let score = 0;
      const total = questions.length;
      let resultatHTML = `<h3>Votre score : <span id="score-value">0</span>/${total} (<span id="note-value">0</span>/20)</h3>`;
      resultatDiv.innerHTML = resultatHTML;

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const explanationDiv = q.querySelector(".explanation");
        applyNeutralExplanationStyle(explanationDiv);
        let isCorrect = false;

        const checkboxes = q.querySelectorAll(`input[type='checkbox']`);
        const radios = q.querySelectorAll(`input[type='radio']`);

        if (checkboxes.length > 0) {
          const correctAnswers = q.getAttribute("data-correct-qcm").split('');
          const userAnswers = [];
          const checkedCheckboxes = q.querySelectorAll(`input[type='checkbox']:checked`);
          for (let k = 0; k < checkedCheckboxes.length; k++) {
            userAnswers.push(checkedCheckboxes[k].value);
          }


          if (userAnswers.length === correctAnswers.length) {
            isCorrect = userAnswers.every(function (answer) {
              return correctAnswers.includes(answer);
            });
          }
          const correctAnswersText = correctAnswers.join(',').toUpperCase();
          if (isCorrect) {
            applyCorrectExplanationStyle(explanationDiv);
          } else {
            applyIncorrectExplanationStyle(explanationDiv, q.getAttribute("data-explication"), correctAnswersText);
          }


        } else if (radios.length > 0) {
          const correctValue = q.getAttribute("data-correct");
          const selectedRadio = q.querySelector(`input[type='radio']:checked`);

          if (selectedRadio) {
            if (selectedRadio.value === correctValue) {
              isCorrect = true;
            }
          }
          const correctAnswersText = q.getAttribute("data-correct").toUpperCase();
          if (isCorrect) {
            applyCorrectExplanationStyle(explanationDiv);
          } else {
            applyIncorrectExplanationStyle(explanationDiv, q.getAttribute("data-explication"), correctAnswersText);
          }
        }


        if (isCorrect) {
          score++;
        }
        explanationDiv.style.fontSize = "1.1em";
        explanationDiv.style.display = 'block';
        renderLatexInCorrections();

      }

      document.getElementById("score-value").textContent = score;
      document.getElementById("note-value").textContent = ((score / total) * 20).toFixed(1);
      resultatDiv.style.display = "block";
      renderLatexInCorrections();
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const questions = document.querySelectorAll('.question');

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (question.dataset.difficulte) {
      const difficulte = parseInt(question.dataset.difficulte);
      const etoiles = document.createElement('span');
      etoiles.classList.add('etoiles');
      etoiles.setAttribute('aria-label', `Difficulté : ${difficulte} sur 5`);

      for (let j = 1; j <= 5; j++) {
        const etoile = document.createElement('span');
        etoile.classList.add('etoile');
        if (j > difficulte) {
          etoile.classList.add('cachee');
        }
        etoiles.appendChild(etoile);
      }
      const consigne = question.querySelector('.consigne');
      if (consigne) {
        consigne.prepend(etoiles);
      }
    }
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const initTheme = function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    applyTheme(isDark);
    createThemeButton(isDark);
  };

  const applyTheme = function (isDark) {
    const theme = isDark ? 'dark' : 'light';
    const root = document.documentElement;

    const themeEntries = Object.entries(themeSwitcher.themes[theme]);
    for (let i = 0; i < themeEntries.length; i++) {
      const [varName, value] = themeEntries[i];
      root.style.setProperty(varName, value);
    }


    localStorage.setItem('theme', theme);
  };

  const createThemeButton = function (initialDark) {
    const navbar = document.querySelector('.navbar');
    const toggleBtn = document.createElement('button');

    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = initialDark ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', function () {
      const currentTheme = localStorage.getItem('theme') || 'light';
      const newDarkMode = currentTheme === 'light';
      applyTheme(newDarkMode);
      toggleBtn.innerHTML = newDarkMode ? '☀️' : '🌙';
    });

    navbar.appendChild(toggleBtn);
  };

  initTheme();
});


const themeSwitcher = {
  themes: {
    light: {
      '--primary-color': '#0098b3',
      '--primary-color-transparent': '#0098b3b9',
      '--primary-color-light': '#e1f5fe',
      '--contrast-color': '#001c22',
      '--blue-silk': '#044f67',
      '--light-color': '#a2f1ff',
      '--white': '#f4f4f9',
      '--qcm_box': '#2b9884bf',
      '--qcm_q': '#167671bf',
      '--shadow': '0.15em 0.15em 0.25em rgba(0, 0, 0, 0.15)',
      '--dark-shadow': '0.15em 0.15em 0.3em rgba(0, 0, 0, 0.2)',
      '--shadow-footer': '0 -0.15em 0.3em rgba(0, 0, 0, 0.2)',
      '--correct': '#4CAF50',
      '--correct-light': '#e8f5e9',
      '--false': '#d82c1f',
      '--texte': '#001114',
      '--false-light': '#ffebee',
      '--body-background-color': '#f8f9fa',
      '--hover-background-menu': '#005a80',
      '--dropdown-background': '#007099',
      '--dropdown-submenu-background': '#004b66',
      '--checkbox-background-hover': '#ccc',
      '--checkbox-btn-background': '#eee',
      '--grey-ddd': '#ddd',
      '--warning': '#ed6c02',
      '--warning-light': '#fff8e1',
      '--black-0-15': 'rgba(0, 0, 0, 0.15)',
      '--black-0-2': 'rgba(0, 0, 0, 0.2)',
      '--black-0-3': 'rgba(0, 0, 0, 0.3)',
      '--gold': 'gold',
      '--yellow': 'yellow',
      '--grey-checkbox-hover': '#ccc',
      '--white-0-3-hover-radio': 'rgba(255, 255, 255, 0.3)',
      '--grey-333': '#333',
      '--light-grey-eee': '#eee',
      '--green-7bc51b62': '#7bc51b62',
      '--red-e91728': '#e91728',
      '--red-845-alpha-134-0-0': 'rgba(134, 0, 0, 0.845)',
      '--start-hue-page': '150',
      '--end-hue-page': '280',
      '--page-saturation': '70%',
      '--page-lightness': '75%',
    },
    dark: {
      '--primary-color': '#141414',
      '--primary-color-transparent': 'rgba(0, 0, 0, 0.73)',
      '--primary-color-light': '#141414',
      '--contrast-color': '#0f0f0f',
      '--blue-silk': '#111',
      '--light-color': '#ccc',
      '--white': '#f4f4f9',
      '--texte': '#f4f4f9',
      '--qcm_box': 'rgba(0, 0, 0, 0.75)',
      '--qcm_q': 'rgba(0, 0, 0, 0.75)',
      '--shadow': '0.15em 0.15em 0.25em rgba(255, 255, 255, 0.05)',
      '--dark-shadow': '0.15em 0.15em 0.3em rgba(255, 255, 255, 0.08)',
      '--shadow-footer': '0 -0.15em 0.3em rgba(255, 255, 255, 0.08)',
      '--correct': '#4CAF50',
      '--correct-light': 'rgba(76, 175, 80, 0.05)',
      '--false': '#d82c1f',
      '--false-light': 'rgba(216, 44, 31, 0.05)',
      '--body-background-color': '#000',
      '--hover-background-menu': '#141414',
      '--dropdown-background': '#101010',
      '--dropdown-submenu-background': '#141414',
      '--checkbox-background-hover': '#555',
      '--checkbox-btn-background': '#111',
      '--grey-ddd': '#555',
      '--warning': '#ffb300',
      '--warning-light': 'rgba(255, 179, 0, 0.05)',
      '--black-0-15': 'rgba(255, 255, 255, 0.05)',
      '--black-0-2': 'rgba(255, 255, 255, 0.08)',
      '--black-0-3': 'rgba(255, 255, 255, 0.15)',
      '--gold': '#ffca28',
      '--yellow': '#ffeb3b',
      '--grey-checkbox-hover': '#555',
      '--white-0-3-hover-radio': 'rgba(255, 255, 255, 0.15)',
      '--grey-333': '#bbb',
      '--light-grey-eee': '#111',
      '--green-7bc51b62': 'rgba(76, 142, 27, 0.2)',
      '--red-e91728': '#f44336',
      '--red-845-alpha-134-0-0': 'rgba(244, 67, 54, 0.845)',
      '--start-hue-page': '200',
      '--end-hue-page': '300',
      '--page-saturation': '50%',
      '--page-lightness': '25%',
    },
  },
};


document.addEventListener('DOMContentLoaded', function () {
  const pages = document.querySelectorAll('.page');
  const numPages = pages.length;
  const virtualNumPages = Math.max(numPages, 10);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageId = page.id;
    const pageNumber = parseInt(pageId.replace('page', ''), 10);
    const ratio = (pageNumber - 1) / (virtualNumPages - 1 <= 0 ? 1 : virtualNumPages - 1);
    page.style.setProperty('--page-ratio', ratio.toString());
  }
});