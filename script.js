const on_off = document.getElementById('on_off');
const afficheur = document.getElementById('afficheur');
const boutons = document.querySelectorAll('.boutons button');
const calculatrice = document.querySelector('.calculatrice');
const conteneur = document.querySelector('.container');

const boutonSombre = document.getElementById('mode_sombre');
const boutonClair = document.getElementById('mode_clair');

let eteint = true;
let timeoutId;

// ==========================================
// 1. GESTION DE L'ÉCRAN ET DES CALCULS
// ==========================================

function allumerEcran() {
    if (eteint) {
        eteint = false;
        afficheur.style.opacity = '1';
        afficherMessage("Bonjour...", () => {
            afficheur.value = "0";
        });
    } else {
        eteindreEcran();
    }
}

function afficherMessage(message, callback) {
    let index = 0;
    afficheur.value = "";

    function afficherLettre() {
        if (eteint) return;

        if (index < message.length) {
            afficheur.value += message.charAt(index);
            timeoutId = setTimeout(afficherLettre, 120);
            index++;
        } else if (callback) {
            timeoutId = setTimeout(callback, 250);
        }
    }
    afficherLettre();
}

function eteindreEcran() {
    clearTimeout(timeoutId);
    afficheur.value = "";
    afficheur.style.opacity = '0.3';
    eteint = true;
}

function realiserCalcul() {
    try {
        let expression = afficheur.value;

        expression = expression
            .replace(/X/g, '*')
            .replace(/÷/g, '/')
            .replace(/,/g, '.')
            .replace(/%/g, '/100');

        expression = expression.replace(/(\d)\(/g, '$1*(');

        let resultat = eval(expression);

        if (resultat === Infinity || resultat === -Infinity || isNaN(resultat)) {
            afficheur.value = "Erreur";
            return;
        }

        resultat = Math.round((resultat + Number.EPSILON) * 1e10) / 1e10;

        afficheur.value = resultat.toString().replace(/\./g, ',');
    } catch (error) {
        afficheur.value = "Erreur";
    }
}

function ajouterVirgule() {
    let partieAfficheur = afficheur.value.split(/[\+\-\*\/X÷%]/);
    let dernierePartie = partieAfficheur[partieAfficheur.length - 1];

    if (!dernierePartie.includes(',')) {
        afficheur.value += ',';
    }
}

function gererParenthese() {
    const valeurActuelle = afficheur.value;
    const dernierCaractere = valeurActuelle.slice(-1);
    const nombreParenthesesOuvrantes = (valeurActuelle.match(/\(/g) || []).length;
    const nombreParenthesesFermantes = (valeurActuelle.match(/\)/g) || []).length;

    if (nombreParenthesesOuvrantes <= nombreParenthesesFermantes || 
        valeurActuelle === "0" || 
        ['+', '-', '*', '/', 'X', '÷', '(', '%'].includes(dernierCaractere)) {
        if (valeurActuelle === "0") {
            afficheur.value = '(';
        } else {
            afficheur.value += '(';
        }
    }
    else if (nombreParenthesesOuvrantes > nombreParenthesesFermantes) {
        if (!['+', '-', '*', '/', 'X', '÷', '('].includes(dernierCaractere)) {
            afficheur.value += ')';
        }
    }
}

boutons.forEach(bouton => {
    bouton.addEventListener('click', () => {
        if (eteint) return;

        const valeur = bouton.dataset.val;

        if (afficheur.value === "Erreur") {
            afficheur.value = '0';
        }

        if (valeur === 'AC') {
            afficheur.value = '0';
        } else if (valeur === 'DEL') {
            afficheur.value = afficheur.value.slice(0, -1) || '0';
        } else if (valeur === '=') {
            realiserCalcul();
        } else if (valeur === ',') {
            ajouterVirgule();
        } else if (valeur === '()') {
            gererParenthese();
        } else if (afficheur.value === '0' && !['+', '-', 'X', '÷', '%', ','].includes(valeur)) {
            afficheur.value = valeur;
        } else {
            afficheur.value += valeur;
        }
    });
});

on_off.addEventListener('click', allumerEcran);


// ==========================================
// 2. ORIENTATION AU SURVOL
// ==========================================

function orienterCalculatriceSubtilement(evenement) {
    const largeurFenetre = window.innerWidth;
    const hauteurFenetre = window.innerHeight;

    const positionX = (evenement.clientX - largeurFenetre / 2) / (largeurFenetre / 2);
    const positionY = (evenement.clientY - hauteurFenetre / 2) / (hauteurFenetre / 2);

    const rotationX = positionY * -5;
    const rotationY = positionX * 5;

    calculatrice.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function reinitialiserOrientation() {
    calculatrice.style.transform = `rotateX(0deg) rotateY(0deg)`;
}

conteneur.addEventListener('mousemove', orienterCalculatriceSubtilement);
conteneur.addEventListener('mouseleave', reinitialiserOrientation);


// ==========================================
// 3. GESTION DU THÈME
// ==========================================

function chargerThemePrecedent() {
    const themeStocke = localStorage.getItem('themeCalculatrice');
    if (themeStocke === 'clair') {
        activerThemeClair();
    } else {
        activerThemeSombre();
    }
}

function activerThemeSombre() {
    document.body.classList.remove('mode-clair');
    boutonSombre.classList.add('actif');
    boutonClair.classList.remove('actif');
    localStorage.setItem('themeCalculatrice', 'sombre');
}

function activerThemeClair() {
    document.body.classList.add('mode-clair');
    boutonClair.classList.add('actif');
    boutonSombre.classList.remove('actif');
    localStorage.setItem('themeCalculatrice', 'clair');
}

boutonSombre.addEventListener('click', activerThemeSombre);
boutonClair.addEventListener('click', activerThemeClair);

chargerThemePrecedent();
afficheur.style.opacity = '0.3';