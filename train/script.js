// Créer un canvas dans la page HTML
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let interface = {
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    color : '#FFF',
    texte : ['Placeholder','Place','Texte 3'],
    texteColor : '#000000'
}

let railsGauche = {nombre : 4};
let railsDroite = {nombre : 4};
let stations = {nombre : 3};
let zoneDeJeu = {position : {x : 0, y : 0}, taille : {x : 0, y : 0}};

let interactionStatus = {
    mouseDown : false,
    mousePosition : {
        x : 0,
        y : 0
    },
    dernierElement : {
        type : 'none',
        id : 0,
        hauteur : 0
    },
    elementActuel : {
        type : 'none',
        id : 0,
        hauteur : 0
    }
}

let railsTraces = [{depart : {x : 0, y : 0}, arrivee : {x : 0, y : 0}}];

// Redimensionner le canvas en fonction de la taille de l'écran
function resizeCanvas() {
    canvas.width = window.innerWidth-2;
    canvas.height = window.innerHeight-5;
}

function interaction(event) {
    // Définir la position de la souris
    let x = event.clientX;
    let y = event.clientY;

    // Définir l'interaction

    // Si la souris est enfoncée
    if (event.type == 'mousedown' && !interactionStatus.mouseDown) {
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
    else if (event.type == 'mouseup') {
        interactionStatus.mouseDown = false;
        interactionStatus.mousePosition.x = x;
        interactionStatus.mousePosition.y = y;
    }

    // Si la souris est déplacée alors qu'elle est enfoncée
    else if (interactionStatus.mouseDown && event.type == 'mousemove') {
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
    zoneDeJeu.position.x = canvas.width/6;
    zoneDeJeu.position.y = canvas.height/3;
    zoneDeJeu.taille.x = canvas.width/6*4;
    zoneDeJeu.taille.y = canvas.height*2/3;

    // Définir les taille et position des rails à gauche
    railsGauche.rails = [];
    for (let i = 0; i < railsGauche.nombre; i++) {
        railsGauche.rails.push({
            position : {
                x : 0,
                y : canvas.height/3 + i*canvas.height*2/3/railsGauche.nombre + canvas.height*2/3/railsGauche.nombre/4
            },
            taille : {
                x : canvas.width/6,
                y : canvas.height/3/railsGauche.nombre
            }
        });
    }

    // Définir les taille et position des rails à droite

    railsDroite.rails = [];
    for (let i = 0; i < railsDroite.nombre; i++) {
        railsDroite.rails.push({
            position : {
                x : canvas.width/6*5,
                y : canvas.height/3 + i*canvas.height*2/3/railsDroite.nombre + canvas.height*2/3/railsDroite.nombre/4
            },
            taille : {
                x : canvas.width/6,
                y : canvas.height/3/railsDroite.nombre
            }
        });
    }

    // Définir les taille et position des stations au milieu

    stations.stations = [];
    for (let i = 0; i < stations.nombre; i++) {
        stations.stations.push({
            position : {
                x : canvas.width/6*2.5,
                y : canvas.height/3 + i*canvas.height*2/3/stations.nombre + canvas.height*2/3/stations.nombre/4
            },
            taille : {
                x : canvas.width/6,
                y : canvas.height/3/stations.nombre
            }
        });
    }
}


// Actualiser le canvas toutes les frames
function draw() {

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner quelque chose sur le canvas
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Définir la taille de l'interface
    interface.width = canvas.width;
    interface.height = canvas.height/3;

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
        ctx.fillText(interface.texte[i], canvas.width/2, canvas.height/3/2/interface.texte.length + i*canvas.height/3/interface.texte.length);
    }


    // Zone de jeu
    genererRailsEtStations();

    // Dessiner les rails à gauche
    ctx.fillStyle = '#000000';
    /*for (let i = 0; i < railsGauche; i++) {
        ctx.fillRect(0, canvas.height/3 + i*canvas.height*2/3/railsGauche + canvas.height*2/3/railsGauche/4, canvas.width/6, canvas.height/3/railsGauche);
    }*/
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

    // Dessiner un rectangle qui relie la position du curseur à la position de l'élement sélectionné
    if (interactionStatus.dernierElement.type != 'none') {
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        if (interactionStatus.dernierElement.type == 'railsGauche') {
            height = railsGauche.rails[interactionStatus.dernierElement.id].taille.y;

            // Se déplacer au point de départ
            ctx.moveTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y);
            
            //Dessiner le rectangle
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y-height/2);
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y+height/2);
            ctx.lineTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y + height);
            // Remplir le rectangle
            ctx.fillStyle = '#000000';
            ctx.fill();
        }
        if (interactionStatus.dernierElement.type == 'railsDroite') {
            height = railsDroite.rails[interactionStatus.dernierElement.id].taille.y;

            // Se déplacer au point de départ
            ctx.moveTo(railsDroite.rails[interactionStatus.dernierElement.id].position.x, railsDroite.rails[interactionStatus.dernierElement.id].position.y);
            
            //Dessiner le rectangle
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y-height/2);
            ctx.lineTo(interactionStatus.mousePosition.x, interactionStatus.mousePosition.y+height/2);
            ctx.lineTo(railsDroite.rails[interactionStatus.dernierElement.id].position.x, railsDroite.rails[interactionStatus.dernierElement.id].position.y + height);
            // Remplir le rectangle
            ctx.fillStyle = '#000000';
            ctx.fill();
        }

        // Si le rail tracé est sur une station
        if (interactionStatus.dernierElement.type == 'railsGauche' && interactionStatus.elementActuel.type == 'stations') {
            // Attache à le rails à la station
            ctx.lineTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y + height);
            ctx.lineTo(railsGauche.rails[interactionStatus.dernierElement.id].position.x + railsGauche.rails[interactionStatus.dernierElement.id].taille.x, railsGauche.rails[interactionStatus.dernierElement.id].position.y);
            // Remplir le rectangle
            ctx.fillStyle = '#000000';
            ctx.fill();
        }



        ctx.stroke();
    }
    console.log(interactionStatus.dernierElement.type)




 
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