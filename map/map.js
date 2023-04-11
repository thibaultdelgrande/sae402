/*if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)))
{
    alert("Pour pouvoir jouer, vous devez utiliser un appareil mobile.");
}*/


fetch('etapes.json')
  .then(response => response.json())
  .then(data => {
    etapes = data.etapes;
    console.log(etapes);
        // Si aucune valeur pour id_status n'est trouvée dans les cookies, on initialise à 0
    if (document.cookie.indexOf("id_status") == -1) {
        id_status = 0;
        document.cookie = "id_status=0";
    }
    else {
        id_status = parseInt(document.cookie.split("id_status=")[1].split(";")[0]);
    }

    console.log(id_status);


    if (etapes[id_status].type == "goto" && etapes[id_status]) {
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
    }



  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des données JSON :', error);
});



function initMap() {
    // Adapter la taille de l'écran pour qu'elle prenne le tier supérieur de l'image
    var map = document.getElementById("map");

    // Tant que etape n'est pas défini, on attend
    if (typeof etapes == "undefined") {
        console.log("Waiting for etapes to be defined...")
        setTimeout(initMap, 100);
        return;
    }

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

document.onload = initMap();