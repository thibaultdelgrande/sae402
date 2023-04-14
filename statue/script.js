let tableau = {
    "width": 4,
    "height": 5,
    "case" : [
        {"id" : 0,  "rotation" : 0},
        {"id" : 1, "rotation" : 0},
        {"id" : 2, "rotation" : 0},
        {"id" : 3, "rotation" : 0},
        {"id" : 4, "rotation" : 0},
        {"id" : 5, "rotation" : 0},
        {"id" : 6, "rotation" : 0},
        {"id" : 7, "rotation" : 0},
        {"id" : 8, "rotation" : 0},
        {"id" : 9, "rotation" : 0},
        {"id" : 10, "rotation" : 0},
        {"id" : 11, "rotation" : 0},
        {"id" : 12, "rotation" : 0},
        {"id" : 13, "rotation" : 0},
        {"id" : 14, "rotation" : 0},
        {"id" : 15, "rotation" : 0},
        {"id" : 16, "rotation" : 0},
        {"id" : 17, "rotation" : 0},
        {"id" : 18, "rotation" : 0},
        {"id" : 19, "rotation" : 0}

    ]
}

function AffichageTableau() {
    // Si le tableau est dans l'odre, on affiche un message de victoire
    if (tableau.case.every((element, index) => element.id === index)) {
        document.querySelector("#win").style.display = "flex";
        return;
    }

    // Affichage du tableau
    document.querySelector("#tableau").innerHTML = "";
    tableau.case.forEach(function (element) {
        image = document.createElement("img");
        image.src = "img/case_"+(element.id+1)+".png";
        image.dataset.id = element.id;
        image.rotation = element.rotation;
        image.style.transform = "rotate(" + image.rotation + "deg)";
        image.addEventListener("click", clicked);
        document.querySelector("#tableau").appendChild(image);
    });

    // Créer les roues sur lesquelles on peut cliquer pour faire tourner les cases
    for (let i = 0; i < tableau.width; i++) {
            let roue = document.createElement("img");
            roue.src = "img/roue.svg";
            roue.dataset.id = i;
            roue.addEventListener("click", clicked);
            document.querySelector("#roues").appendChild(roue);
    }
}

// position_case correspond à la position de la case en haut à gauche
function clicked() {
    position_case= Array.prototype.indexOf.call(this.parentNode.children, this);
    rotate(position_case);
}

function rotate(position_case){
    // Vérifie si la case est sur la ligne droite ou la ligne du bas du tableau
    if (position_case % tableau.width == tableau.width - 1 || position_case >= tableau.width * (tableau.height - 1)) {
        return;
    }

    let cases = [
        tableau.case[position_case],
        tableau.case[position_case + 1],
        tableau.case[position_case + tableau.width + 1],
        tableau.case[position_case + tableau.width]

    ];

    cases.forEach(function (element) {
        // Rotation de la case en haut 
        if (element.rotation == 270) {
            element.rotation = 0;
        } else {
            element.rotation += 90;
        }
    });

    // Modification du tableau
    tableau.case[position_case + 1 ] = cases[0];
    tableau.case[position_case + tableau.width + 1] = cases[1];
    tableau.case[position_case + tableau.width] = cases[2];
    tableau.case[position_case] = cases[3];

    AffichageTableau();
}


// Mélange le tableau

function melange() {
    for (let i = 0; i < 25; i++) {
        let position_case = Math.floor(Math.random() * (tableau.width * tableau.height - 1));
        rotate(position_case);
    }
}


melange();

AffichageTableau();