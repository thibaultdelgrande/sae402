// Créer un canvas dans la page HTML
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let id_railsTrace = 0;
let score = 0;
// Créer la classe Train

let interface = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: '#F4D58D',
    texte: ['Join the rails to help the trains moving',0],
    texteColor: '#14110F'
}

let railsGauche = { nombre: 4 };
let railsDroite = { nombre: 4 };
let stations = { nombre: 3 };
let zoneDeJeu = { position: { x: 0, y: 0 }, taille: { x: 0, y: 0 } };

let interactionStatus = {
    mouseDown: false,
    mousePosition: {
        x: 0,
        y: 0
    },
    dernierElement: {
        type: 'none',
        id: 0,
        hauteur: 0
    },
    elementActuel: {
        type: 'none',
        id: 0,
        hauteur: 0
    }
}

let railsTraces = [];
let trains = [];

// Redimensionner le canvas en fonction de la taille de l'écran
function resizeCanvas() {
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 5;
}

function interaction(event) {
    // Définir la position de la souris
    let x = event.clientX;
    let y = event.clientY;

    // Définir l'interaction

    // Si la souris est enfoncée ou si l'utilisateur touche l'écran
    if ((event.type == 'mousedown' || event.type == 'touchstart') && !interactionStatus.mouseDown ){
        interactionStatus.mouseDown = true;
        interactionStatus.mousePosition.x = x;
        interactionStatus.mousePosition.y = y;

        // Si la souris est sur un rail à gauche
        for (let i = 0; i < railsGauche.nombre; i++) {
            if (x > railsGauche.rails[i].position.x && x < railsGauche.rails[i].position.x + railsGauche.rails[i].taille.x && y > railsGauche.rails[i].position.y && y < railsGauche.rails[i].position.y + railsGauche.rails[i].taille.y) {
                interactionStatus.dernierElement.type = 'railsGauche';
                interactionStatus.dernierElement.id = i;
                interactionStatus.dernierElement.hauteur = railsGauche.rails[i].taille.y;
            }
        }

        // Si la souris est sur un rail à droite
        for (let i = 0; i < railsDroite.nombre; i++) {
            if (x > railsDroite.rails[i].position.x && x < railsDroite.rails[i].position.x + railsDroite.rails[i].taille.x && y > railsDroite.rails[i].position.y && y < railsDroite.rails[i].position.y + railsDroite.rails[i].taille.y) {
                interactionStatus.dernierElement.type = 'railsDroite';
                interactionStatus.dernierElement.id = i;
            }
        }

        // Si la souris est sur une station
        for (let i = 0; i < stations.nombre; i++) {
            if (x > stations.stations[i].position.x && x < stations.stations[i].position.x + stations.stations[i].taille.x && y > stations.stations[i].position.y && y < stations.stations[i].position.y + stations.stations[i].taille.y) {
                interactionStatus.dernierElement.type = 'stations';
                interactionStatus.dernierElement.id = i;
            }
        }
    }

    // Si la souris est relachée
    else if (event.type == 'mouseup' || event.type == 'touchend') {
        interactionStatus.mouseDown = false;
        interactionStatus.mousePosition.x = x;
        interactionStatus.mousePosition.y = y;
    }

    // Si la souris est déplacée alors qu'elle est enfoncée
    else if (interactionStatus.mouseDown && event.type == 'mousemove' || event.type == 'touchmove') {
        interactionStatus.mousePosition.x = x;
        interactionStatus.mousePosition.y = y;
    }

    // Définir si la souris est sur un élément
    if (interactionStatus.mouseDown) {

        // Valeur par défaut
        interactionStatus.elementActuel.type = 'none';

        // Si la souris est sur un rail à gauche
        for (let i = 0; i < railsGauche.nombre; i++) {
            if (x > railsGauche.rails[i].position.x && x < railsGauche.rails[i].position.x + railsGauche.rails[i].taille.x && y > railsGauche.rails[i].position.y && y < railsGauche.rails[i].position.y + railsGauche.rails[i].taille.y) {
                interactionStatus.elementActuel.type = 'railsGauche';
                interactionStatus.elementActuel.id = i;
                interactionStatus.elementActuel.hauteur = railsGauche.rails[i].taille.y;
            }
        }

        // Si la souris est sur un rail à droite
        for (let i = 0; i < railsDroite.nombre; i++) {
            if (x > railsDroite.rails[i].position.x && x < railsDroite.rails[i].position.x + railsDroite.rails[i].taille.x && y > railsDroite.rails[i].position.y && y < railsDroite.rails[i].position.y + railsDroite.rails[i].taille.y) {
                interactionStatus.elementActuel.type = 'railsDroite';
                interactionStatus.elementActuel.id = i;
            }
        }

        // Si la souris est sur une station
        for (let i = 0; i < stations.nombre; i++) {
            if (x > stations.stations[i].position.x && x < stations.stations[i].position.x + stations.stations[i].taille.x && y > stations.stations[i].position.y && y < stations.stations[i].position.y + stations.stations[i].taille.y) {
                interactionStatus.elementActuel.type = 'stations';
                interactionStatus.elementActuel.id = i;
            }
        }
    }

}

function genererRailsEtStations() {
    // Définir la taille et la position de la zone de jeu
    zoneDeJeu.position.x = canvas.width / 6;
    zoneDeJeu.position.y = canvas.height / 3;
    zoneDeJeu.taille.x = canvas.width / 6 * 4;
    zoneDeJeu.taille.y = canvas.height * 2 / 3;

    // Définir les taille et position des rails à gauche
    railsGauche.rails = [];
    for (let i = 0; i < railsGauche.nombre; i++) {
        railsGauche.rails.push({
            position: {
                x: 0,
                y: canvas.height / 3 + i * canvas.height * 2 / 3 / railsGauche.nombre + canvas.height * 2 / 3 / railsGauche.nombre / 4
            },
            taille: {
                x: canvas.width / 6,
                y: canvas.height / 3 / railsGauche.nombre
            },
            traverse: false
        });
    }

    // Définir les taille et position des rails à droite

    railsDroite.rails = [];
    for (let i = 0; i < railsDroite.nombre; i++) {
        railsDroite.rails.push({
            position: {
                x: canvas.width / 6 * 5,
                y: canvas.height / 3 + i * canvas.height * 2 / 3 / railsDroite.nombre + canvas.height * 2 / 3 / railsDroite.nombre / 4
            },
            taille: {
                x: canvas.width / 6,
                y: canvas.height / 3 / railsDroite.nombre
            }
        });
    }

    // Définir les taille et position des stations au milieu

    stations.stations = [];
    for (let i = 0; i < stations.nombre; i++) {
        stations.stations.push({
            position: {
                x: canvas.width / 6 * 2.5,
                y: canvas.height / 3 + i * canvas.height * 2 / 3 / stations.nombre + canvas.height * 2 / 3 / stations.nombre / 4
            },
            taille: {
                x: canvas.width / 6,
                y: canvas.height / 3 / stations.nombre
            }
        });
    }
}

// Fonction pour ajouter un rail
function ajouterRails(objet) {
    //Supprime les rails qui rentrent en conflit
    //Créer un une liste des rails temporaire
    let railsTracesTemp = [];
    railsTraces.forEach( rail =>{
        console.log(rail);
        // Aucun train n'est sur le rail
            console.log(rail);
            if (
                //Si le type de départ et d'arrivée sont les mêmes
                (objet.depart.type == rail.depart.type) && (objet.arrivee.type == rail.arrivee.type) && (
                    //Si l'id de départ est le même
                    (objet.depart.id == rail.depart.id) ||
                    //Si l'id d'arrivée est le même
                    (objet.arrivee.id == rail.arrivee.id) ||
                    //Si l'id de objet de départ est supérieur à l'id de rail de départ et que l'id de objet d'arrivée est inférieur à l'id de rail d'arrivée
                    (objet.depart.id > rail.depart.id) && (objet.arrivee.id < rail.arrivee.id) ||
                    //Si l'id de objet de départ est inférieur à l'id de rail de départ et que l'id de objet d'arrivée est supérieur à l'id de rail d'arrivée
                    (objet.depart.id < rail.depart.id) && (objet.arrivee.id > rail.arrivee.id)
                ) ||
                //Si le type de départ et d'arrivée sont inversés
                (objet.depart.type == rail.arrivee.type) && (objet.arrivee.type == rail.depart.type) && (
                    //Si l'id de départ de objet est le même que l'id d'arrivée de rail
                    (objet.depart.id == rail.arrivee.id) ||
                    //Si l'id d'arrivée de objet est le même que l'id de départ de rail
                    (objet.arrivee.id == rail.depart.id) ||
                    //Si l'id de objet de départ est supérieur à l'id de rail d'arrivée et que l'id de objet d'arrivée est inférieur à l'id de rail de départ
                    (objet.depart.id > rail.arrivee.id) && (objet.arrivee.id < rail.depart.id) ||
                    //Si l'id de objet de départ est inférieur à l'id de rail d'arrivée et que l'id de objet d'arrivée est supérieur à l'id de rail de départ
                    (objet.depart.id < rail.arrivee.id) && (objet.arrivee.id > rail.depart.id)
                )
            )
            {
                // Si le rail est traversé
                if (rail.traverse) {
                    objet = rail;
                }

            }
        else
        {
            railsTracesTemp.push(rail);
        }

    });
    railsTraces = railsTracesTemp;
    //Ajoute le rail
    railsTraces.push(objet);
}


// Actualiser le canvas toutes les frames
function draw() {

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner quelque chose sur le canvas
    ctx.fillStyle = '#FECC57';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Définir la taille de l'interface
    interface.width = canvas.width;
    interface.height = canvas.height / 3;

    // Dessiner l'interface
    ctx.fillStyle = interface.color;
    ctx.fillRect(interface.x, interface.y, interface.width, interface.height);

    // Définir la taille du texte
    ctx.font = '30px Arial';

    // Définir la couleur du texte
    ctx.fillStyle = interface.texteColor;

    // Définir la position du texte
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < interface.texte.length; i++) {
        ctx.fillText(interface.texte[i], canvas.width / 2, canvas.height / 3 / 2 / interface.texte.length + i * canvas.height / 3 / interface.texte.length);
    }


    // Zone de jeu
    genererRailsEtStations();

    // Dessiner les rails à gauche
    ctx.fillStyle = '#7E7F83';
    railsGauche.rails.forEach(element => {
        ctx.fillRect(element.position.x, element.position.y, element.taille.x, element.taille.y);
    });

    // Dessiner les rails à droite
    railsDroite.rails.forEach(element => {
        ctx.fillRect(element.position.x, element.position.y, element.taille.x, element.taille.y);
    });

    // Dessiner les stations au milieu
    stations.stations.forEach(element => {
        ctx.fillRect(element.position.x, element.position.y, element.taille.x, element.taille.y);
    });

    // Trace les rails tracés
    railsTraces.forEach(element => {
        // Si le départ est à gauche
        if (element.depart.type == 'railsGauche') {
            ctx.moveTo(railsGauche.rails[element.depart.id].position.x + railsGauche.rails[element.depart.id].taille.x, railsGauche.rails[element.depart.id].position.y)
            ctx.lineTo(stations.stations[element.arrivee.id].position.x, stations.stations[element.arrivee.id].position.y)
            ctx.lineTo(stations.stations[element.arrivee.id].position.x, stations.stations[element.arrivee.id].position.y + stations.stations[element.arrivee.id].taille.y)
            ctx.lineTo(railsGauche.rails[element.depart.id].position.x + railsGauche.rails[element.depart.id].taille.x, railsGauche.rails[element.depart.id].position.y + railsGauche.rails[element.depart.id].taille.y)
        }
        // Si le départ est à droite
        else if (element.depart.type == 'railsDroite') {
            ctx.moveTo(railsDroite.rails[element.depart.id].position.x, railsDroite.rails[element.depart.id].position.y)
            ctx.lineTo(stations.stations[element.arrivee.id].position.x + stations.stations[element.arrivee.id].taille.x, stations.stations[element.arrivee.id].position.y)
            ctx.lineTo(stations.stations[element.arrivee.id].position.x + stations.stations[element.arrivee.id].taille.x, stations.stations[element.arrivee.id].position.y + stations.stations[element.arrivee.id].taille.y)
            ctx.lineTo(railsDroite.rails[element.depart.id].position.x, railsDroite.rails[element.depart.id].position.y + railsDroite.rails[element.depart.id].taille.y)
        }
        // Si le départ est une station
        else if (element.depart.type == 'stations') {
            if (element.arrivee.type == 'railsDroite') {
                ctx.moveTo(stations.stations[element.depart.id].position.x + stations.stations[element.depart.id].taille.x, stations.stations[element.depart.id].position.y)
                ctx.lineTo(stations.stations[element.depart.id].position.x + stations.stations[element.depart.id].taille.x, stations.stations[element.depart.id].position.y + stations.stations[element.depart.id].taille.y)
                ctx.lineTo(railsDroite.rails[element.arrivee.id].position.x, railsDroite.rails[element.arrivee.id].position.y + railsDroite.rails[element.arrivee.id].taille.y)
                ctx.lineTo(railsDroite.rails[element.arrivee.id].position.x, railsDroite.rails[element.arrivee.id].position.y)
            }
            else if (element.arrivee.type == 'railsGauche') {
                ctx.moveTo(stations.stations[element.depart.id].position.x, stations.stations[element.depart.id].position.y)
                ctx.lineTo(stations.stations[element.depart.id].position.x, stations.stations[element.depart.id].position.y + stations.stations[element.depart.id].taille.y)
                ctx.lineTo(railsGauche.rails[element.arrivee.id].position.x + railsGauche.rails[element.arrivee.id].taille.x, railsGauche.rails[element.arrivee.id].position.y + railsGauche.rails[element.arrivee.id].taille.y)
                ctx.lineTo(railsGauche.rails[element.arrivee.id].position.x + railsGauche.rails[element.arrivee.id].taille.x, railsGauche.rails[element.arrivee.id].position.y)
            }
        }
        ctx.fillStyle = '#7E7F83';
        ctx.fill();

    });

    // Dessiner un rectangle qui relie la position du curseur à la position de l'élement sélectionné
    ctx.strokeStyle = '#7E7F83';
    ctx.beginPath();
    if (interactionStatus.dernierElement.type == 'railsGauche') {
        height = railsGauche.rails[interactionStatus.dernierElement.id].taille.y;

        // Se déplacer au point de départ
        ctx.moveTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y);

        //Dessiner le rectangle
        ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y - height / 2);
        ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y + height / 2);
        ctx.lineTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y + height);
        // Remplir le rectangle
        ctx.fillStyle = '#7E7F83';
        ctx.fill();
    }
    else if (interactionStatus.dernierElement.type == 'railsDroite') {
        height = railsDroite.rails[interactionStatus.dernierElement.id].taille.y;

        // Se déplacer au point de départ
        ctx.moveTo(railsDroite.rails[interactionStatus.dernierElement.id].position.x, railsDroite.rails[interactionStatus.dernierElement.id].position.y);

        //Dessiner le rectangle
        ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y - height / 2);
        ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y + height / 2);
        ctx.lineTo(railsDroite.rails[interactionStatus.dernierElement.id].position.x, railsDroite.rails[interactionStatus.dernierElement.id].position.y + height);
        // Remplir le rectangle
        ctx.fillStyle = '#7E7F83';
        ctx.fill();
    }
    else if (interactionStatus.dernierElement.type == 'stations') {
        height = stations.stations[interactionStatus.dernierElement.id].taille.y;


        //Si le curseur est à gauche de la station
        if (interactionStatus.mousePosition.x < stations.stations[interactionStatus.dernierElement.id].position.x) {
            // Se déplacer au point de départ
            ctx.moveTo(stations.stations[interactionStatus.dernierElement.id].position.x, stations.stations[interactionStatus.dernierElement.id].position.y);

            //Dessiner le rectangle
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y - height / 2);
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y + height / 2);
            ctx.lineTo(stations.stations[interactionStatus.dernierElement.id].position.x, stations.stations[interactionStatus.dernierElement.id].position.y + height);
            // Remplir le rectangle
            ctx.fillStyle = '#7E7F83';
            ctx.fill();
        }
        //Si le curseur est à droite de la station
        else if (interactionStatus.mousePosition.x > stations.stations[interactionStatus.dernierElement.id].position.x + stations.stations[interactionStatus.dernierElement.id].taille.x) {
            // Se déplacer au point de départ
            ctx.moveTo(stations.stations[interactionStatus.dernierElement.id].position.x + stations.stations[interactionStatus.dernierElement.id].taille.x, stations.stations[interactionStatus.dernierElement.id].position.y);

            //Dessiner le rectangle
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y - height / 2);
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y + height / 2);
            ctx.lineTo(stations.stations[interactionStatus.dernierElement.id].position.x + stations.stations[interactionStatus.dernierElement.id].taille.x, stations.stations[interactionStatus.dernierElement.id].position.y + height);
            // Remplir le rectangle
            ctx.fillStyle = '#7E7F83';
            ctx.fill();
        }
    }


    ctx.closePath();



    // Si le rail tracé est sur une station
    if (interactionStatus.dernierElement.type == 'railsGauche' && interactionStatus.elementActuel.type == 'stations') {
        // Attache à le rails à la station
        ctx.moveTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y)
        ctx.lineTo(stations.stations[interactionStatus.elementActuel.id].position.x, stations.stations[interactionStatus.elementActuel.id].position.y)
        ctx.lineTo(stations.stations[interactionStatus.elementActuel.id].position.x, stations.stations[interactionStatus.elementActuel.id].position.y + stations.stations[interactionStatus.elementActuel.id].taille.y)
        ctx.lineTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y + railsGauche.rails[interactionStatus.dernierElement.id].taille.y)
        ctx.fillStyle = '#7E7F83';
        ctx.fill();

        interactionStatus.mouseDown = false;
        interactionStatus.dernierElement.type = 'none';

        // Ajouter la liaison au tableau
        ajouterRails({
            traverse: false,
            id: id_railsTrace,
            depart: {
                type: 'railsGauche',
                id: interactionStatus.dernierElement.id
            },
            arrivee: {
                type: 'stations',
                id: interactionStatus.elementActuel.id
            }
        });
        id_railsTrace++;
    }
    else if (interactionStatus.dernierElement.type == 'railsDroite' && interactionStatus.elementActuel.type == 'stations') {
        // Attache à le rails à la station
        ctx.moveTo(railsDroite.rails[interactionStatus.dernierElement.id].position.x, railsDroite.rails[interactionStatus.dernierElement.id].position.y)
        ctx.lineTo(stations.stations[interactionStatus.elementActuel.id].position.x + stations.stations[interactionStatus.elementActuel.id].taille.x, stations.stations[interactionStatus.elementActuel.id].position.y)
        ctx.lineTo(stations.stations[interactionStatus.elementActuel.id].position.x + stations.stations[interactionStatus.elementActuel.id].taille.x, stations.stations[interactionStatus.elementActuel.id].position.y + stations.stations[interactionStatus.elementActuel.id].taille.y)
        ctx.lineTo(railsDroite.rails[interactionStatus.dernierElement.id].position.x, railsDroite.rails[interactionStatus.dernierElement.id].position.y + railsDroite.rails[interactionStatus.dernierElement.id].taille.y)
        ctx.fillStyle = '#7E7F83';
        ctx.fill();

        interactionStatus.mouseDown = false;
        interactionStatus.dernierElement.type = 'none';

        // Ajouter la liaison au tableau
        ajouterRails({
            depart: {
                type: 'railsDroite',
                id: interactionStatus.dernierElement.id
            },
            arrivee: {
                type: 'stations',
                id: interactionStatus.elementActuel.id
            }
        });

    }
    else if (interactionStatus.dernierElement.type == 'stations' && interactionStatus.elementActuel.type == 'railsGauche') {
        // Attache à le rails à la station
        ctx.moveTo(stations.stations[interactionStatus.dernierElement.id].position.x, stations.stations[interactionStatus.dernierElement.id].position.y)
        ctx.lineTo(railsGauche.rails[interactionStatus.elementActuel.id].position.x + railsGauche.rails[interactionStatus.elementActuel.id].taille.x, railsGauche.rails[interactionStatus.elementActuel.id].position.y)
        ctx.lineTo(railsGauche.rails[interactionStatus.elementActuel.id].position.x + railsGauche.rails[interactionStatus.elementActuel.id].taille.x, railsGauche.rails[interactionStatus.elementActuel.id].position.y + railsGauche.rails[interactionStatus.elementActuel.id].taille.y)
        ctx.lineTo(stations.stations[interactionStatus.dernierElement.id].position.x, stations.stations[interactionStatus.dernierElement.id].position.y + stations.stations[interactionStatus.dernierElement.id].taille.y)
        ctx.fillStyle = '#7E7F83';
        ctx.fill();

        interactionStatus.mouseDown = false;
        interactionStatus.dernierElement.type = 'none';

        // Ajouter la liaison au tableau
        ajouterRails({
            depart: {
                type: 'stations',
                id: interactionStatus.dernierElement.id
            },
            arrivee: {
                type: 'railsGauche',
                id: interactionStatus.elementActuel.id
            }
        });
    }

    else if (interactionStatus.dernierElement.type == 'stations' && interactionStatus.elementActuel.type == 'railsDroite') {
        // Attache à le rails à la station
        ctx.moveTo(stations.stations[interactionStatus.dernierElement.id].position.x + stations.stations[interactionStatus.dernierElement.id].taille.x, stations.stations[interactionStatus.dernierElement.id].position.y)
        ctx.lineTo(railsDroite.rails[interactionStatus.elementActuel.id].position.x, railsDroite.rails[interactionStatus.elementActuel.id].position.y)
        ctx.lineTo(railsDroite.rails[interactionStatus.elementActuel.id].position.x, railsDroite.rails[interactionStatus.elementActuel.id].position.y + railsDroite.rails[interactionStatus.elementActuel.id].taille.y)
        ctx.lineTo(stations.stations[interactionStatus.dernierElement.id].position.x + stations.stations[interactionStatus.dernierElement.id].taille.x, stations.stations[interactionStatus.dernierElement.id].position.y + stations.stations[interactionStatus.dernierElement.id].taille.y)
        ctx.fillStyle = '#7E7F83';
        ctx.fill();

        interactionStatus.mouseDown = false;
        interactionStatus.dernierElement.type = 'none';

        // Ajouter la liaison au tableau
        ajouterRails({
            depart: {
                type: 'stations',
                id: interactionStatus.dernierElement.id
            },
            arrivee: {
                type: 'railsDroite',
                id: interactionStatus.elementActuel.id
            }
        });
    }    

    // Créé des trains qui apparaissent àléatoirement à gauche et à droite sur les rails
    if (Math.random() < 0.01) {
        let position;
        let cote_arrivee;
        let id;
        // De quel côté le train va apparaître
        let cote = Math.random() < 0.5 ? 'gauche' : 'droite';
        // Sur quel rail le train va apparaître
        if (cote == 'gauche') {
            id = Math.floor(Math.random() * railsGauche.rails.length);
            position = {
                x: -50,
                y: railsGauche.rails[id].position.y + railsGauche.rails[id].taille.y / 2
            }
            cote_arrivee = 'droite';
        }
        if (cote == 'droite') {
            id = Math.floor(Math.random() * railsDroite.rails.length);
            position = {
                x: canvas.width+50,
                y: railsDroite.rails[id].position.y + railsDroite.rails[id].taille.y / 2
            }
            cote_arrivee = 'gauche';
        }

        //Si le train n'est 

        // Créer le train
        let train = {
            position: position,
            cote_depart: cote,
            cote_arrivee: cote_arrivee,
            vitesse: {
                x: 0,
                y: 0
            },
            id_depart: id,
            traverse: false,
            objectif: {
                type: 'none',
                x: 0,
                y: 0,
                id: 0
            },
            railTraverse: {
                id: 0,
            }
        }
        
        trains.push(train);

    }

    // Dessiner les trains
    for (let i = 0; i < trains.length; i++) {
        ctx.beginPath();
        ctx.arc(trains[i].position.x, trains[i].position.y, 25, 0, 2 * Math.PI);
        ctx.fillStyle = '#14110F';
        ctx.fill();
    }

    // Déplacer les trains
    trains.forEach(train => {
        // Si le train au bord du rail de départ
        if ((train.cote_depart == 'gauche' && train.position.x > railsGauche.rails[train.id_depart].position.x - 5 + (railsGauche.rails[train.id_depart].taille.x) && train.position.x < railsGauche.rails[train.id_depart].position.x + 5 + (railsGauche.rails[train.id_depart].taille.x)) && !(train.traverse)) {
            // Si le rail sur lequel le train est est relié à un station ou si une station est reliée au rail sur lequel le train est
            for (let i = 0; i < railsTraces.length; i++) {
                let rail = railsTraces[i];
                if (rail.depart.type == 'railsGauche' && rail.depart.id == train.id_depart && rail.arrivee.type == 'stations' && !(rail.traverse)) {
                    train.objectif.x = stations.stations[rail.arrivee.id].position.x;
                    train.objectif.y = stations.stations[rail.arrivee.id].position.y + stations.stations[rail.arrivee.id].taille.y / 2;
                    train.objectif.type = 'stations';
                    train.objectif.id = rail.arrivee.id;
                    train.traverse = true;
                    train.railTraverse.id = rail.id;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                }
                if (rail.depart.type == 'stations' && rail.arrivee.type == 'railsGauche' && rail.arrivee.id == train.id_depart && !(rail.traverse)) {
                    train.objectif.x = stations.stations[rail.depart.id].position.x;
                    train.objectif.y = stations.stations[rail.depart.id].position.y + stations.stations[rail.depart.id].taille.y / 2;
                    train.objectif.type = 'stations';
                    train.objectif.id = rail.depart.id;
                    train.traverse = true;
                    train.railTraverse.id = rail.id;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                    
                }
            };
        }
        else if ((train.cote_depart == 'droite' && train.position.x > railsDroite.rails[train.id_depart].position.x - 5 && train.position.x < railsDroite.rails[train.id_depart].position.x + 5) && !(train.traverse)) {
            for (let i = 0; i < railsTraces.length; i++) {
                let rail = railsTraces[i];
                if (rail.depart.type == 'railsDroite' && rail.depart.id == train.id_depart && rail.arrivee.type == 'stations' && !(rail.traverse)) {
                    train.objectif.x = stations.stations[rail.arrivee.id].position.x + stations.stations[rail.arrivee.id].taille.x;
                    train.objectif.y = stations.stations[rail.arrivee.id].position.y + stations.stations[rail.arrivee.id].taille.y / 2;
                    train.objectif.type = 'stations';
                    train.objectif.id = rail.arrivee.id;
                    train.traverse = true;
                    train.railTraverse.id = rail.id;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                
                }
                if (rail.depart.type == 'stations' && rail.arrivee.type == 'railsDroite' && rail.arrivee.id == train.id_depart && !(rail.traverse)) {
                    train.objectif.x = stations.stations[rail.depart.id].position.x + stations.stations[rail.depart.id].taille.x;
                    train.objectif.y = stations.stations[rail.depart.id].position.y + stations.stations[rail.depart.id].taille.y / 2;
                    train.objectif.type = 'stations';
                    train.objectif.id = rail.depart.id;
                    train.traverse = true;
                    train.railTraverse.id = rail.id;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                }
            };

        }
        //Si le train vient de gauche et est sur une station
        else if ((train.cote_depart == 'gauche' && train.objectif.type == 'stations' && train.position.x > stations.stations[train.objectif.id].position.x + stations.stations[train.objectif.id].taille.x - 5 && train.position.x < stations.stations[train.objectif.id].position.x + stations.stations[train.objectif.id].taille.x + 5) && !(train.traverse)) {
            for (let i = 0; i < railsTraces.length; i++) {
                let rail = railsTraces[i];
                if (rail.depart.type == 'stations' && rail.depart.id == train.objectif.id && rail.arrivee.type == 'railsDroite' && !(rail.traverse)) {
                    train.objectif.x = railsDroite.rails[rail.arrivee.id].position.x;
                    train.objectif.y = railsDroite.rails[rail.arrivee.id].position.y + railsDroite.rails[rail.arrivee.id].taille.y / 2;
                    train.objectif.type = 'railsDroite';
                    train.objectif.id = rail.arrivee.id;
                    train.traverse = true;
                    train.railTraverse.id = rail.id;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                }
                if (rail.depart.type == 'railsDroite' && rail.arrivee.type == 'stations' && rail.arrivee.id == train.objectif.id && !(rail.traverse)) {
                    train.objectif.x = railsDroite.rails[rail.depart.id].position.x;
                    train.objectif.y = railsDroite.rails[rail.depart.id].position.y + railsDroite.rails[rail.depart.id].taille.y/2;
                    train.objectif.type = 'railsDroite';
                    train.objectif.id = rail.depart.id;
                    train.traverse = true;
                    train.railTraverse.id = rail.id;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                }
            };
        }
        //Si le train vient de droite et est sur une station
        else if ((train.cote_depart == 'droite' && train.objectif.type == 'stations' && train.position.x > stations.stations[train.objectif.id].position.x - 5 && train.position.x < stations.stations[train.objectif.id].position.x + 5) && !(train.traverse)) {
            for (let i = 0; i < railsTraces.length; i++) {
                let rail = railsTraces[i];
                if (rail.depart.type == 'stations' && rail.depart.id == train.objectif.id && rail.arrivee.type == 'railsGauche' && !(rail.traverse)) {
                    train.objectif.x = railsGauche.rails[rail.arrivee.id].position.x + railsGauche.rails[rail.arrivee.id].taille.x;
                    train.objectif.y = railsGauche.rails[rail.arrivee.id].position.y + railsGauche.rails[rail.arrivee.id].taille.y / 2;
                    train.objectif.type = 'railsGauche';
                    train.objectif.id = rail.arrivee.id;
                    train.traverse = true;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                }
                if (rail.depart.type == 'railsGauche' && rail.arrivee.type == 'stations' && rail.arrivee.id == train.objectif.id && !(rail.traverse)) {
                    train.objectif.x = railsGauche.rails[rail.depart.id].position.x + railsGauche.rails[rail.depart.id].taille.x;
                    train.objectif.y = railsGauche.rails[rail.depart.id].position.y + railsGauche.rails[rail.depart.id].taille.y / 2;
                    train.objectif.type = 'railsGauche';
                    train.objectif.id = rail.depart.id;
                    train.traverse = true;
                    // Détermine la vitesse du train pour qu'il arrive à l'objectif en ligne droite
                    train.vitesse.x = (train.objectif.x - train.position.x) / 200;
                    train.vitesse.y = (train.objectif.y - train.position.y) / 200;
                    railsTraces[i].traverse = true;
                }
            };
        }


        //Si le train est en train de traverser
        else if (train.traverse) {
            train.position.x += train.vitesse.x;
            train.position.y += train.vitesse.y;
            // Si le train est arrivé à l'objectif
            if (train.position.x > train.objectif.x - 5 && train.position.x < train.objectif.x + 5 && train.position.y > train.objectif.y - 5 && train.position.y < train.objectif.y + 5) {
                train.traverse = false;
                railsTraces.forEach(rail => {
                    if (rail.id == train.railTraverse.id) {
                        rail.traverse = false;
                    }
                });
                // Si le train est arrivé aux rails d'en face ajouter des points
                if (train.objectif.type == 'railsGauche' || train.objectif.type == 'railsDroite') {
                    score += 1;
                    interface.texte[1] = score;
                }
            }
        }
        else {
            //Déplacer le train automatiquement
            if (train.cote_depart == 'gauche') {
                train.position.x += 1;
            }
            else if (train.cote_depart == 'droite') {
                train.position.x -= 1;
            }

        }
    });
    // Appeler la fonction draw à chaque frame
    requestAnimationFrame(draw);
}



// Redimensionner le canvas au chargement de la page
resizeCanvas();

// Ajouter un listener pour redimensionner le canvas quand la taille de la fenêtre change
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', interaction);
canvas.addEventListener('mouseup', interaction);
canvas.addEventListener('mousemove', interaction);

// Démarrer l'animation
draw();