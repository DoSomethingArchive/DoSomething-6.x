$(document).ready(function () {
  initialize();
});

var markers = [];
var map;
var data;

function $_GET(q,s) { 
  s = s ? s : window.location.search; 
  var re = new RegExp('&'+q+'(?:=([^&]*))?(?=&|$)','i'); 
  return (s=s.replace(/^\?/,'&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined; 
} 


function initialize() {
  var myLatlng = new google.maps.LatLng(39.607804, -97.536621);
  var myOptions = {
    zoom: 3,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  querySignups();
  $('#postal-code,#input-proximity').keypress(function(key) {
      if (key.which == 13) querySignups();
  });
}

function shrinkText(text) {
    text = text.substring(0, 100);
    text = text.substring(0, text.lastIndexOf(' '));
    return text + '...';
}

function querySignups() {
  var zipStr = '';
  zip = $("#postal-code").val();
  distance = $("#input-proximity").val();
  $('#spinner').show();
  if (typeof(zip) !== 'undefined' && typeof(distance) !== 'undefined' && zip && distance) {
    zipStr = '/'+zip+'_'+distance;
  }
  var url = '/stepuptobullying/signupsquery'+zipStr;
  $.ajax({
    url: url,
    dataType: 'json',
    success: function (data) {plotPoints(data);}
  });
}

function myclick(i) {
  google.maps.event.trigger(markers[i], "click");
}

function plotPoints(data) {
  clearOverlays();
  deleteOverlays();
  data = data.node;
  var nid=0;
  var paramnid=$_GET('nid');
  if (typeof paramnid !== 'undefined') {
    nid=paramnid;
  }
  if (data && data.constructor != Array) {
    data = [data];
  }
  if (data && data.constructor == Array) {
    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var resultsVar = $('.map-results');
    for (i = 0; i < data.length; i++) {
      (function(signup,i) {
        var newPoint = new google.maps.LatLng(signup.Latitude,signup.Longitude);
        bounds.extend(newPoint);
        setTimeout(function() {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(signup.Latitude,signup.Longitude),
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            zIndex: i
          });
            var locationStr = '';
            if (typeof(signup.City) == "string") {
              locationStr += signup.City;
            }
            if (typeof(signup.Province) == "string") {
              locationStr += ', '+signup.Province;
            }
            if (typeof(signup.Country) == "string") {
              locationStr += ', '+signup.Country;
            }
         var content=             '<div class="marker">'+
                                  '<div class="body">'+
                                  signup.Body+
                                  '</div>'+
                                   '<div class="location">'+
                                   locationStr+
                                  '</div>' +
                                  '</div>';
          colorClass='redquote';
          if (i % 2 == 0) {
            colorClass='bluequote';
          }
          newResult = document.createElement("div");
          $(newResult).addClass(colorClass+" quotation id"+i).html(content);
          $(newResult).click(function() { myclick(i)});
          if (i < 2) {
            $(newResult).find('p:gt(0)').remove();
            var text = $(newResult).find('p').text();
            $(newResult).find('p').html(shrinkText(text));
            resultsVar.append(newResult);

            /*resultsVar.append('<div class="'+colorClass+' quotation">'+
                content+ 
                '</div>');*/
          }
          google.maps.event.addListener(marker, 'click', function(event) {
            var old_zindex = this.getZIndex();
            this.setZIndex(old_zindex - 900);
           infowindow.setContent(content);
          /*  infowindow.setPosition(event.latLng);*/
            infowindow.open(map,marker);
          });
          markers.push(marker);
          //alert('nid is '+signup.nid);
          if (signup.Nid == nid) {
             infowindow.setContent(content);
             infowindow.setPosition(new google.maps.LatLng(signup.Latitude,signup.Longitude));
             infowindow.open(map,marker);
          }
        }, (1000 / data.length) * i );
      })(data[i],i);
    }

  }
  $('#spinner').hide();
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
  if (markers) {
    for (i in markers) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }
}

// Removes the overlays from the map, but keeps them in the array
function clearOverlays() {
  if (markers) {
    for (i in markers) {
      markers[i].setMap(null);
    }
  }
  $('.map-results').html('');
}

