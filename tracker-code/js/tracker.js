function initMap() {
    // Adapter la taille de l'écran pour qu'elle prenne la partie inférieure de l'écran
    var map = document.getElementById("map");
    map.style.height =(window.innerHeight * 0.6) + "px";

    // Créer une carte centrée sur l'utilisateur
    navigator.geolocation.getCurrentPosition(function (position) {
        var latLng = L.latLng(position.coords.latitude, position.coords.longitude);
        var map = L.map('map').setView(latLng, 17);

        // Ajouter un marqueur à l'emplacement de l'utilisateur
        var marker = L.marker(latLng).addTo(map)
            .bindPopup("Vous êtes ici").openPopup();

        // Ajouter une couche de tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    }, function (error) {
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
    }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
}