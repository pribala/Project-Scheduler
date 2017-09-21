// Client ID and API key from the Developer Console
var CLIENT_ID = '744021836761-7eae07i2hr0l1qtdfkhoi1vbrh6h8ue9.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/calendar';
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var submitButton = document.getElementById('addEvent');
var heading = document.getElementById('message');
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    submitButton.style.display ='block';
    heading.style.display = 'none';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    heading.style.display = 'block';
    signoutButton.style.display = 'none';
    submitButton.style.display = 'none';
    $("#owner").empty();
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  //event.preventDefault();
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  //event.preventDefault();
  gapi.auth2.getAuthInstance().signOut();
}

// Map function
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 }
  });
  var geocoder = new google.maps.Geocoder();

 $("body").on('click',".mapBtn", function () {
      var address = $(this).attr("data-loc");
      geocodeAddress(geocoder, map,address);
  });

  var input = document.getElementById('autocomplete');
        var autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', map);
         var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address1 = '';
          if (place.address_components) {
            address1 = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindowContent.children['place-icon'].src = place.icon;
          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-address'].textContent = address1;
          infowindow.open(map, marker);
        });
}

function geocodeAddress(geocoder, resultsMap,address) {
  geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === 'OK') {
          resultsMap.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
          });
      } else {
          Materialize.toast('Geocode was not successful for the following reason: ' + status, 4000);
      }
  });
}