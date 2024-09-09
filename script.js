const on_off = document.getElementById('on_off');
const afficheur = document.getElementById('afficheur');
const un = document.getElementById('un');

const couleurAllumee = 'rgb(127, 205, 127)';
const couleurEteint = 'rgb(153, 204, 153)';

let eteint = true;

function allumerEcran() {
    let index = 0;
    let texte = "Bonjour...";
    if (eteint) {
        afficheur.style.background = couleurAllumee;
        function afficherLettre() {
            if(index < texte.length) {
                afficheur.value += texte.charAt(index);
                index++;
                setTimeout(afficherLettre, 300);
            }
        }
        afficherLettre();
        setTimeout(() => {
            afficheur.value = "0";
        }, 3000);
        eteint = false;
    }
    else {
        afficheur.style.background = couleurEteint;
        afficheur.value = "";
        eteint = true;
    }
}

on_off.addEventListener('click', allumerEcran);
un.addEventListener('click', () => {
    afficheur.value += "1";
});
