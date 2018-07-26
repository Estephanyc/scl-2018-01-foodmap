let map, infowindow, service, posicion;

//busqueda por defecto para el mapa
let range = rangeInput.value
let defaultSearch = inputGroupSelect01.value

// inicializar con la posicion incial
navigator.geolocation.getCurrentPosition(initialize, error)

// si se cambia el input de filtro se vuelve a llamar la funcion que genera el mapa con el nuevo valor de defaultSearch
inputGroupSelect01.addEventListener("change", function () {
    places.innerHTML = ''
    defaultSearch = inputGroupSelect01.value
    initialize(posicion)
});
// si se cambia el rango
rangeInput.addEventListener("change", function (ev) {
    places.innerHTML = ''
    range = ev.currentTarget.value
    initialize(posicion)
}, true);

//funcion que imprime el mapa
function initialize(pos) {

    posicion = pos
    let pyrmont = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
    };
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: pyrmont,
        zoom: 14
    });
    // Marcar la ubicación de la persona
    var punto = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
    let marker = new google.maps.Marker({
        icon: "img/placeholder.png",
        map: map,
        position: punto,
        title: "Mi ubicacion"
    });
    let request = {
         location: pyrmont,
         radius: range,
         type: ['restaurant'],
         keyword: defaultSearch,
    } 
 
    // Poner en el mapa solo los que coinciden con la busqueda
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
                showSites(results[i])
            }
        }
    });
}
// crear los puntos en el mapa
function createMarker(placeMarker) {
    infowindow = new google.maps.InfoWindow();
    console.log(placeMarker.geometry.location)
    let marker = new google.maps.Marker({
        icon: "img/restaurant.png",
        map: map,
        position: placeMarker.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(placeMarker.name);
        infowindow.open(map, this);
    });
}
// mostrar la lista de sitios de acuerdo a los resultados de la busqueda y el mapa
function showSites(placeId) {
    let urlPhoto = placeId.photos[0].getUrl({ maxHeight: 200 })
    places.innerHTML += `             
                 <div class="col-6 col-md-4 places">
  <img src="${urlPhoto}" class="figure-img img-fluid rounded placesImg" onclick="openModal('${placeId.place_id}')" >
  <figcaption class="figure-caption">${placeId.name}</figcaption>
</div>      
                 `
}
//Abrir el modal se activa con el onclick de cada imagen
function openModal(id) {
    $('#exampleModal').modal('show')
    service.getDetails({
        placeId: `${id}`,
    }, function (resultsD, statusD) {

        if (statusD == google.maps.places.PlacesServiceStatus.OK) {

            let open;
            let urlPhoto = resultsD.photos[0].getUrl({ maxHeight: 300 })
            let urlPhoto2 = resultsD.photos[1].getUrl({ maxHeight: 300 })
            let urlPhoto3 = resultsD.photos[2].getUrl({ maxHeight: 300 })

            // condicional open para que no salga false o true
            if (resultsD.opening_hours.open_now == false) {
                open = "cerrado"
            }
            else if (resultsD.opening_hours.open_now == true) {
                open = "Abierto"
            }
            else {
                open = "no registra"
            }

            // mostrar el mapa de la ubicacion especifica y marcar el punto en el mapa
            let mapPlace = new google.maps.Map(document.getElementById('place-map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: {
                    lat: resultsD.geometry.location.lat(),
                    lng: resultsD.geometry.location.lng()
                },
                zoom: 16
            });
            let marker = new google.maps.Marker({
                icon: "img/placeholder.png",
                map: mapPlace,
                position: resultsD.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(resultsD.name);
                infowindow.open(mapPlace, this);
            });

            // mostrar informacion del lugar en el modal
            titleModal.innerHTML = resultsD.name
            direcction.innerHTML = resultsD.formatted_address
            photos.innerHTML = ` 
            <div class="col-4 col-md-4 left"><img src="${urlPhoto}" class="img-thumbnail" width="100%"></div>
             <div class="col-4 col-md-4 left"><img src="${urlPhoto2}" class="img-thumbnail" width="100%"></div>
             <div class="col-4 col-md-4 left"> <img src="${urlPhoto3}" class="img-thumbnail" width="100%"></div>`
            openingH.innerHTML = open
            rating.innerHTML = resultsD.rating
            website.innerHTML = ` <a href="${resultsD.url}">Web Site</a>`
            phone.innerHTML = resultsD.formatted_phone_number
        }
    })
}
function error(err) {
    alert(err.message);
};