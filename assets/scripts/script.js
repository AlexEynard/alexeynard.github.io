document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  if (!menuToggle || !menu) {
    return;
  }

  menuToggle.addEventListener('click', function (event) {
    event.stopPropagation();

    const menuEstVisible = menu.classList.contains('show');

    if (menuEstVisible) {
      menu.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      menu.classList.add('show');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
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

  script.onload = () => {
    configureMathJax();
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
      .catch(err => console.error('Typeset failed: ' + err.message));
  }
}

function renderLatexInCorrections() {
  const explanationDivs = document.querySelectorAll('.explanation');

  explanationDivs.forEach(div => {
    requestIdleCallback(() => {
      if (div.textContent.trim()) {
        MathJax.typesetPromise([div]).catch((err) => console.error("MathJax typeset error:", err));
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadMathJaxAsync();

  const toggleButtons = document.querySelectorAll('.toggle-correction');
  const allCorrections = document.querySelectorAll('.exercice-correction');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      const correction = this.parentElement.nextElementSibling;

      allCorrections.forEach(otherCorrection => {
        if (otherCorrection !== correction && !otherCorrection.classList.contains('hidden')) {
          otherCorrection.classList.add('hidden');
          otherCorrection.style.display = 'none';
          otherCorrection.style.animation = '';
        }
      });

      correction.classList.toggle('hidden');
      if (correction.classList.contains('hidden')) {
        correction.style.display = 'none';
        correction.style.animation = '';
      } else {
        correction.style.display = 'block';
        correction.style.animation = 'slideIn 0.3s ease-in-out forwards';
      }

      renderLatexInCorrections();
    });
  });

  document.getElementById("valider").addEventListener("click", function (event) {
    event.preventDefault();
    const questions = document.querySelectorAll(".q");
    let score = 0;
    const total = questions.length;

    questions.forEach((q) => {
      const correctAnswers = q.getAttribute("data-correct-qcm").split('');
      const explication = q.getAttribute("data-explication");
      const userAnswers = Array.from(q.querySelectorAll(`input[type='checkbox']:checked`)).map(checkbox => checkbox.value);
      const explanationDiv = q.querySelector(".explanation");

      explanationDiv.style.border = "1px solid var(--grey-ddd)";

      let isCorrect = true;

      if (userAnswers.length === 0 && correctAnswers.length > 0) {
        isCorrect = false;
      } else if (userAnswers.length > 0 && correctAnswers.length === 0) {
        isCorrect = false;
      } else {
        if (userAnswers.length !== correctAnswers.length) {
          isCorrect = false;
        } else {
          for (let answer of userAnswers) {
            if (!correctAnswers.includes(answer)) {
              isCorrect = false;
              break;
            }
          }
          if (isCorrect) {
            for (let correctAnswer of correctAnswers) {
              if (!userAnswers.includes(correctAnswer)) {
                isCorrect = false;
                break;
              }
            }
          }
        }
      }


      if (isCorrect) {
        score++;
        explanationDiv.innerHTML = "<strong>Bonne réponse !</strong>";
        explanationDiv.style.backgroundColor = "var(--correct-light)";
        explanationDiv.style.color = "var(--correct)";
        explanationDiv.style.border = "1px solid var(--correct)";
      } else {
        explanationDiv.innerHTML = `<strong>Mauvaise réponse. Les bonnes réponses étaient : ${correctAnswers.join(',').toUpperCase()}.</strong><br> ${explication}`;
        explanationDiv.style.backgroundColor = "var(--false-light)";
        explanationDiv.style.color = "var(--false)";
        explanationDiv.style.border = "1px solid var(--false)";
      }

      explanationDiv.style.fontSize = "1.1em";
      explanationDiv.style.display = "block";
    });

    const resultatDiv = document.getElementById("resultat_qcm");
    const noteFinale = ((score / total) * 20).toFixed(1);
    resultatDiv.innerHTML = `<h3>Votre score : ${score}/${total} (${noteFinale}/20)</h3>`;
    resultatDiv.style.display = "block";

    renderLatexInCorrections();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const questions = document.querySelectorAll('.question');

  questions.forEach(question => {
    if (question.dataset.difficulte) {
      const difficulte = parseInt(question.dataset.difficulte);
      const etoiles = document.createElement('span');
      etoiles.classList.add('etoiles');

      for (let i = 1; i <= 5; i++) {
        const etoile = document.createElement('span');
        etoile.classList.add('etoile');
        if (i > difficulte) {
          etoile.classList.add('cachee');
        }
        etoiles.appendChild(etoile);
      }

      question.querySelector('.consigne').prepend(etoiles);
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    applyTheme(isDark);
    createThemeButton(isDark);
  };

  const applyTheme = (isDark) => {
    const theme = isDark ? 'dark' : 'light';
    const root = document.documentElement;

    Object.entries(themeSwitcher.themes[theme]).forEach(([varName, value]) => {
      root.style.setProperty(varName, value);
    });

    localStorage.setItem('theme', theme);
  };

  const createThemeButton = (initialDark) => {
    const navbar = document.querySelector('.navbar');
    const toggleBtn = document.createElement('button');

    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = initialDark ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', () => {
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
      '--contrast-color': '#212121',
      '--blue-silk': '#044f67',
      '--light-color': '#a2f1ff',
      '--white': '#f4f4f9',
      '--texte': '#001114',
      '--qcm_box': '#2b9884bf',
      '--qcm_q': '#167671bf',
      '--shadow': '0.15em 0.15em 0.25em rgba(0, 0, 0, 0.15)',
      '--dark-shadow': '0.15em 0.15em 0.3em rgba(0, 0, 0, 0.2)',
      '--shadow-footer': '0 -0.15em 0.3em rgba(0, 0, 0, 0.2)',
      '--correct': '#4CAF50',
      '--correct-light': '#e8f5e9',
      '--false': '#d82c1f',
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
      '--hover-background-menu': '#0f0f0f',
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

document.addEventListener("DOMContentLoaded", function () {
  const validerButton = document.getElementById("valider");
  const questions = document.querySelectorAll(".q");
  const resultatDiv = document.getElementById("resultat_qcm");

  if (validerButton) {
    validerButton.addEventListener("click", function (event) {
      event.preventDefault();
      let score = 0;
      const total = questions.length;

      questions.forEach((q) => {
        const correctAnswers = q.getAttribute("data-correct-qcm").split('');
        const explication = q.getAttribute("data-explication");
        const userAnswers = Array.from(q.querySelectorAll(`input[type='checkbox']:checked`)).map(checkbox => checkbox.value);
        const explanationDiv = q.querySelector(".explanation");

        explanationDiv.style.border = "1px solid var(--grey-ddd)";

        let isCorrect = true;

        if (userAnswers.length === 0 && correctAnswers.length > 0) {
          isCorrect = false;
        } else if (userAnswers.length > 0 && correctAnswers.length === 0) {
          isCorrect = false;
        } else {
          if (userAnswers.length !== correctAnswers.length) {
            isCorrect = false;
          } else {
            for (let answer of userAnswers) {
              if (!correctAnswers.includes(answer)) {
                isCorrect = false;
                break;
              }
            }
            if (isCorrect) {
              for (let correctAnswer of correctAnswers) {
                if (!userAnswers.includes(correctAnswer)) {
                  isCorrect = false;
                  break;
                }
              }
            }
          }
        }


        if (isCorrect) {
          score++;
          explanationDiv.innerHTML = "<strong>Bonne réponse !</strong>";
          explanationDiv.style.backgroundColor = "var(--correct-light)";
          explanationDiv.style.color = "var(--correct)";
          explanationDiv.style.borderColor = "1px solid var(--correct)";
        } else {
          explanationDiv.innerHTML = `<strong>Mauvaise réponse. Les bonnes réponses étaient : ${correctAnswers.join(',').toUpperCase()}.</strong><br> ${explication}`;
          explanationDiv.style.backgroundColor = "var(--false-light)";
          explanationDiv.style.color = "var(--false)";
          explanationDiv.style.borderColor = "1px solid var(--false)";
        }

        explanationDiv.style.fontSize = "1.1em";
        explanationDiv.style.display = "block";
      });

      const noteFinale = ((score / total) * 20).toFixed(1);
      resultatDiv.innerHTML = `<h3>Votre score : ${score}/${total} (${noteFinale}/20)</h3>`;
      resultatDiv.style.display = "block";
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const pages = document.querySelectorAll('.page');
  const numPages = pages.length;

  const virtualNumPages = Math.max(numPages, 10);

  pages.forEach(page => {
    const pageId = page.id;
    const pageNumber = parseInt(pageId.replace('page', ''), 10);

    const ratio = (pageNumber - 1) / (virtualNumPages - 1 <= 0 ? 1 : virtualNumPages - 1);

    page.style.setProperty('--page-ratio', ratio.toString());
  });
});