const on_off = document.getElementById('on_off');
const afficheur = document.getElementById('afficheur');
const boutons = document.querySelectorAll('.boutons button');

const couleurAllumee = 'rgb(127, 205, 127)';
const couleurEteint = 'rgb(153, 204, 153)';
let eteint = true;
let timeoutId;  // Variable pour stocker l'identifiant du setTimeout

function allumerEcran() {
    if (eteint) {
        eteint = false;  // On allume l'écran
        afficheur.style.background = couleurAllumee;
        afficherMessage("Bonjour...", () => {
            afficheur.value = "0";  // Affiche "0" après le message
        });
    } else {
        eteindreEcran();
    }
}

function afficherMessage(message, callback) {
    let index = 0;
    afficheur.value = "";  // Réinitialise l'affichage

    function afficherLettre() {
        if (eteint) return;  // Arrêter l'affichage si l'écran est éteint

        if (index < message.length) {
            afficheur.value += message.charAt(index);
            timeoutId = setTimeout(afficherLettre, 300);  // Continuer à afficher chaque lettre
            index++;
        } else if (callback) {
            timeoutId = setTimeout(callback, 300);  // Exécuter le callback après le message
        }
    }
    afficherLettre();
}

function eteindreEcran() {
    clearTimeout(timeoutId);  // Annule le timeout en cours
    afficheur.style.background = couleurEteint;
    afficheur.value = "";
    eteint = true;
}

function realiserCalcul() {
    try {
        // Remplace les caractères de multiplication et de division pour la compatibilité JavaScript
        let expression = afficheur.value
            .replace('X', '*')
            .replace('÷', '/')
            .replace(/,/g, '.'); // Remplace les virgules par des points

        // Ajoute un opérateur '*' entre les nombres et les parenthèses adjacentes
        expression = expression.replace(/(\d)\(/g, '$1*(');

        // Évalue l'expression mathématique
        afficheur.value = eval(expression);  // Exécuter le calcul
    } catch (error) {
        afficheur.value = "Erreur";  // Afficher une erreur si l'évaluation échoue
    }
}


function ajouterVirgule() {
    let partieAfficheur = afficheur.value.split(/[\+\-\*\/]/);  // Séparer par opérateur
    let dernierePartie = partieAfficheur[partieAfficheur.length - 1];  // Dernière partie de l'expression

    if (!dernierePartie.includes('.')) {  // S'il n'y a pas déjà une virgule
        afficheur.value += ',';  // Ajouter la virgule
    }
}

function gererParenthese() {
    const valeurActuelle = afficheur.value;
    const dernierCaractere = valeurActuelle.slice(-1);
    const nombreParenthesesOuvrantes = (valeurActuelle.match(/\(/g) || []).length;
    const nombreParenthesesFermantes = (valeurActuelle.match(/\)/g) || []).length;

    // Ajouter une parenthèse ouvrante
    if (nombreParenthesesOuvrantes <= nombreParenthesesFermantes || 
        dernierCaractere === "" || 
        ['+', '-', '*', '/', 'X', '÷', '('].includes(dernierCaractere)) {
        afficheur.value += '(';
    }
    // Ajouter une parenthèse fermante
    else if (nombreParenthesesOuvrantes > nombreParenthesesFermantes) {
        // Vérifier que la dernière entrée est un chiffre ou une parenthèse ouvrante
        if (!['+', '-', '*', '/', 'X', '÷'].includes(dernierCaractere) && 
            dernierCaractere !== '(') {
            afficheur.value += ')';
        }
    }
}

// Ajouter l'événement click pour tous les boutons
boutons.forEach(bouton => {
    bouton.addEventListener('click', () => {
        if (eteint) return;  // Ne rien faire si la calculatrice est éteinte

        const valeur = bouton.textContent;

        // Réagir en fonction du bouton cliqué
        if (valeur === 'AC') {
            afficheur.value = '0';  // Réinitialiser
        } else if (valeur === 'DEL') {
            afficheur.value = afficheur.value.slice(0, -1) || '0';  // Effacer le dernier caractère
        } else if (valeur === '=') {
            realiserCalcul();  // Effectuer le calcul
        } else if (valeur === ',') {
            ajouterVirgule();  // Gérer la virgule
        } else if (valeur === '()') {
            gererParenthese();  // Gérer les parenthèses
        } else if (afficheur.value === '0') {
            afficheur.value = valeur;  // Remplacer le 0 initial
        } else {
            afficheur.value += valeur;  // Ajouter la valeur au texte existant
        }
    });
});

// Gestionnaire d'événements pour le bouton On/Off
on_off.addEventListener('click', allumerEcran);
