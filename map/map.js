/*if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)))
{
    alert("Pour pouvoir jouer, vous devez utiliser un appareil mobile.");
}
else{
  */


// Récupérer les données JSON
fetch('etapes.json')
  .then(response => response.json())
  .then(data => {
    etapes = data.etapes;
    // Si aucune valeur pour id_status n'est trouvée dans les cookies, on initialise à 0
    if (document.cookie.indexOf("id_status") == -1) {
        id_status = 0;
        document.cookie = "id_status="+id_status+" ; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
    else {
        id_status = parseInt(document.cookie.split("id_status=")[1].split(";")[0]);
    }
    etape();
})
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données JSON :', error);
}
);

let map_initalized = false;
let caroussel_initialized = false;


// Détecte quelle étape est en cours
function etape(){

    // Tant que etape n'est pas défini, on attend
    if (typeof etapes == "undefined") {
        setTimeout(etape, 100);
        return;
    }

    if (etapes[id_status].type === "goto" || etapes[id_status].type === "start") {
        if (!map_initalized) {
            initMap();
            map_initalized = true;
        }
        goto();
    }
    else if (etapes[id_status].type == "cinematic" || etapes[id_status].type == "launch_game"){
        cinematic();
    }
    window.requestAnimationFrame(etape);
}

function goto(){
    var lastUpdateTime = 0;
    var minUpdateInterval = 10000; // 10 secondes
    var minDistanceInterval = 10; // 10 mètres

    navigator.geolocation.watchPosition(function (position) {
        var currentTime = new Date().getTime();
        if (!(currentTime - lastUpdateTime < minUpdateInterval)) {
            var latLng = [position.coords.latitude, position.coords.longitude];

            // Vérifier l'utilisateur est assez proche de l'objectif
            if (L.latLng(latLng).distanceTo(L.latLng(etapes[id_status].destination)) < minDistanceInterval) {
                // Mettre à jour la position de l'utilisateur
                lastPosition = latLng;
                lastUpdateTime = currentTime;
            }
        }
        // Mettre à jour la carte et le marqueur de position
        updateMap(latLng);
    });

    // Si le type de l'étape est goto
    if (etapes[id_status].type === "goto" && caroussel_initialized == false){
        // Afficher le carousel
        document.querySelector(".carousel").style.display = "block";
        // Récupère les données du fichier facts.json
        fetch('facts.json')
        .then(response => response.json())
        .then(data => {
            data[etapes[id_status].name].forEach(function(fact){
                element.innerHTML =
                    `<div class="carousel-item">
                        <img src="${fact.image}" alt="">
                        <div class="info">
                            <h1>${etapes[id_status].name}</h1>
                            <p>
                                ${fact.anecdote}
                            </p>
                        </div>
                    </div>`;
                document.querySelector(".carousel-container").appendChild(element);
                console.log(element)
            });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données JSON :', error);
        });
        caroussel_initialized = true;
    }
}

function cinematic(){
    
    // Cacher la carte si elle est affichée
    document.getElementById("map").style.display = "none";
    // Afficher le texte de la cinématique
    document.querySelector(".cinematic").style.display = "block";
    document.querySelector(".message").innerText = etapes[id_status].message;
    // Changer l'image de la cinématique
    document.querySelector(".character").src = etapes[id_status].image;
    // Changer l'image de fond
    document.querySelector(".character").style.backgroundImage = "url(" + etapes[id_status].background + ")";

    // Si l'etapes est un launch_game
    if (etapes[id_status].type == "launch_game"){
        // Afficher le bouton pour lancer le jeu
        document.querySelector(".launch-game").style.display = "block";
        // Si l'utilisateur clique sur le bouton
        document.querySelector(".launch-game").onclick = function(){
            // Rediriger vers le jeu
            window.location.href = etapes[id_status].url;
        };
    }
    else {
                // Si l'utilisateur clique sur la cinématique
        document.querySelector(".cinematic").onclick = function(){
            // Mettre à jour id_status
            id_status = id_status + 1;
            document.cookie = "id_status=" + id_status + " ; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            // Cacher la cinématique
            document.querySelector(".cinematic").style.display = "none";
            // Afficher la carte
            document.getElementById("map").style.display = "block";
    }
    }
}

//Détecte si l'utilisateur est arrivé à destination
function updateMap(latLng) {
    if (L.latLng(latLng).distanceTo(L.latLng(etapes[id_status].destination)) < 150) {
        // Mettre à jour id_status
        id_status = id_status + 1;
        document.cookie = "id_status=" + id_status + " ; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
}





function initMap() {
    // Adapter la taille de l'écran pour qu'elle prenne le tier supérieur de l'image
    var map = document.getElementById("map");

    if (etapes[id_status].type == "start"){
        map.style.height = (window.innerHeight / 1.25) + "px";
        document.querySelector(".start").style.display = "block";
        document.querySelector(".start").innerText = etapes[id_status].message;
    }
    else if (etapes[id_status].type == "goto"){
        map.style.height = (window.innerHeight / 2.5) + "px";
    }

    // Créer une carte centrée sur l'utilisateur affichant la destination
    navigator.geolocation.getCurrentPosition(function (position) {
        var latLng = [position.coords.latitude, position.coords.longitude];
        var map = L.map('map').setView(latLng, 15);


        // Ajouter un marqueur à l'emplacement de l'utilisateur
        var marker = L.marker(latLng).addTo(map)
            .bindPopup("Vous êtes ici").openPopup();

        // Ajouter un marqueur à l'emplacement de la destination
        var marker = L.marker(etapes[id_status].destination).addTo(map)
            .bindPopup(etapes[id_status].name).openPopup();

        // Trouve un trajet à pied entre les deux points
        var route = L.Routing.control({
            waypoints: [
                L.latLng(latLng),
                L.latLng(etapes[id_status].destination)
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: 'red', opacity: 1, weight: 5 }]
            },
            //préciser le type de transport (piéton)
            router: L.Routing.osrmv1({
                profile: 'foot'
            }),
            // Cache le trajet
            show: false,
            // Cache le formulaire
            collapsible: false,
        }).addTo(map);

        // Ajouter une couche de tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    }/*,function (error) {
        var message;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = "Vous avez refusé la géolocalisation.";
                break;
            case error.POSITION_UNAVAILABLE:
                message = "La géolocalisation n'est pas disponible sur votre appareil.";
                break;
            case error.TIMEOUT:
                message = "La géolocalisation a expiré.";
                break;
            case error.UNKNOWN_ERROR:
                message = "Une erreur inconnue s'est produite.";
                break;
            default:
                message = "Une erreur inconnue s'est produite.";
                break;
        }
        alert("Impossible de récupérer votre position : " + message);
    }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });*/);
}

document.onload = etape();


  
//}