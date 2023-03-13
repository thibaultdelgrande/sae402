// Créer un canvas dans la page HTML
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let interface = {
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    color : '#FFF',
    texte : ['Placeholder','Place','Texte 3','Bébou','Quoicoubeh'],
    texteColor : '#000000'
}

let railsGauche = 4;
let railsDroite = 4;

// Redimensionner le canvas en fonction de la taille de l'écran
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

    // Dessiner les rails à gauche
    ctx.fillStyle = '#000000';
    for (let i = 0; i < railsGauche; i++) {
        ctx.fillRect(0, canvas.height/3 + i*canvas.height*2/3/railsGauche, canvas.width/6, canvas.height/3/railsGauche);
    }

    // Dessiner les rails à droite
    for (let i = 0; i < railsDroite; i++) {
        ctx.fillRect(canvas.width/6*5, canvas.height/3 + i*canvas.height/3/railsDroite, canvas.width/6, canvas.height/3/railsDroite);
    }
 
    // Appeler la fonction draw à chaque frame
    requestAnimationFrame(draw);
}

// Redimensionner le canvas au chargement de la page
resizeCanvas();

// Ajouter un listener pour redimensionner le canvas quand la taille de la fenêtre change
window.addEventListener('resize', resizeCanvas);

// Démarrer l'animation
draw();