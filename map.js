let map , infowindow, service, posicion
let defaultSearch = inputGroupSelect01.value

navigator.geolocation.getCurrentPosition(initialize, error)

inputGroupSelect01.addEventListener("change", function () {
    places.innerHTML = ''
    defaultSearch = inputGroupSelect01.value
    initialize(posicion)
    });

function initialize(pos) {
    console.log(pos)
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
    let request = {
        location: pyrmont,
        radius: '100',
        query: defaultSearch
    };
    // Marcar la ubicacion de la person
    var punto = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
    console.log(punto)
    let marker = new google.maps.Marker({
        icon: "img/placeholder.png",
        map: map,
        position: punto,
        title: "Mi ubicacion"
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
               // console.log(results[i])
                showSites(results[i])
            }
        }
    }); 
}
function createMarker(placeMarker) {
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

function showSites(placeId) {
    let urlPhoto = placeId.photos[0].getUrl({ maxHeight: 200  })
    places.innerHTML += `             
                 <div class="col-6 col-md-4 places">
  <img src="${urlPhoto}" class="figure-img img-fluid rounded placesImg" onclick="openModal('${placeId.place_id}')" >
  <figcaption class="figure-caption">${placeId.name}</figcaption>
</div>      
                 `
}

function openModal(id) {
    let open;
    $('#exampleModal').modal('show')
    service.getDetails({
        placeId: `${id}`,
    }, function (resultsD, statusD) {
        if (statusD == google.maps.places.PlacesServiceStatus.OK) {
            let urlPhoto = resultsD.photos[0].getUrl({ maxHeight: 300})
            console.log(resultsD)
            titleModal.innerHTML = resultsD.name
            direcction.innerHTML = resultsD.formatted_address
            photo.innerHTML = ` <img src="${urlPhoto}" class="img-thumbnail">`
            if (resultsD.opening_hours.open_now  == false)
            {
                open = "cerrado"
            }
            else if (resultsD.opening_hours.open_now == true){
                open = "Abierto"
            }
            else{
                open = "no registra"
            }
            openingH.innerHTML = open 
            rating.innerHTML = resultsD.rating
            website.innerHTML =` <a href="${resultsD.url}">Web Site</a>`
            phone.innerHTML = resultsD.formatted_phone_number

        }
    })
}
function error(err) {
    alert(err.message);
};