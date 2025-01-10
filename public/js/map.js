
    // Map create karo
    var map = L.map('map').setView([25.55, 83.18], 9); // [latitude, longitude] aur zoom level set karo
  
    // OSM Tile Layer ko add karo
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var marker = L.marker([25.55, 83.18]).addTo(map);
    marker.bindPopup("<b>Hello world!</b><br>I am a marker.").openPopup();

    