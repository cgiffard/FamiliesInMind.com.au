function initMap() {
    var location = {
        lat: -35.2798264,
        lng: 149.125666
    };

    var map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 18,
        apiKey: "AIzaSyBsmiUBvPaRZwzl_CW1G533NzJ76IEBdz0",
        disableDefaultUI: true,
        panControl: true,
        zoomControl: true,
        scaleControl: true
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP,
        title: "Families In Mind Psychology",
    });

    var info = new google.maps.InfoWindow({
        content: document.querySelector("aside.popover").innerHTML
    });

    marker.addListener('click', function() {
        info.open(map, marker);
    });

    marker.setMap(map);
}