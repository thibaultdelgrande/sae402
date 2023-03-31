/*if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)))
{
    alert("Pour pouvoir jouer, vous devez utiliser un appareil mobile.");
}*/


etat = [{"nom" : "start", "type" : "goto", "destination" : [47.7491774113385, 7.315668269555352]}]
id_status = 0




function initMap() {
    // Adapter la taille de l'écran pour qu'elle prenne le tier supérieur de l'image
    var map = document.getElementById("map");
    map.style.height = (window.innerHeight / 2.5) + "px";

    // Créer une carte centrée sur l'utilisateur affichant la destination
    navigator.geolocation.getCurrentPosition(function (position) {
        var latLng = [position.coords.latitude, position.coords.longitude];
        var map = L.map('map').setView(latLng, 15);


        // Ajouter un marqueur à l'emplacement de l'utilisateur
        var marker = L.marker(latLng).addTo(map)
            .bindPopup("Vous êtes ici").openPopup();

        // Ajouter un marqueur à l'emplacement de la destination
        var marker = L.marker(etat[id_status].destination).addTo(map)
            .bindPopup("Destination").openPopup();

        // Trouve un trajet à pied entre les deux points
        var route = L.Routing.control({
            waypoints: [
                L.latLng(latLng),
                L.latLng(etat[id_status].destination)
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ color: 'red', opacity: 1, weight: 5 }]
            }
        }).addTo(map);
        

        // Ajouter une couche de tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    }, function (error) {
        var message;
        /*
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
        alert("Impossible de récupérer votre position : " + message);*/
    }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
}


var lastUpdateTime = 0;
var minUpdateInterval = 10000; // 10 secondes
var minDistanceInterval = 10; // 10 mètres

navigator.geolocation.watchPosition(function (position) {
    var currentTime = new Date().getTime();
    if (currentTime - lastUpdateTime < minUpdateInterval) {
        return;
    }

    var latLng = [position.coords.latitude, position.coords.longitude];

    // Vérifier si la distance parcourue est suffisante pour mettre à jour la carte
    if (L.latLng(latLng).distanceTo(L.latLng(lastPosition)) < minDistanceInterval) {
        return;
    }

    // Mettre à jour la position de l'utilisateur
    lastPosition = latLng;

    // Mettre à jour la carte et le marqueur de position
    updateMap(latLng);
});
