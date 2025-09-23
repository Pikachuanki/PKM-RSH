// peta.js (revisi full, dengan warna KRB)

// Inisialisasi peta
var map = L.map('map').setView([-8.219, 114.369], 12);

// Basemap
var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri &mdash; Source: Esri, Maxar' }
).addTo(map);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '© OpenStreetMap contributors' }
);

function styleKRB(feature) {
  let remark = (feature.properties.REMARK || "").toLowerCase(); // biar case-insensitive

  // Kondisi paling spesifik dulu
  if (remark.includes("berpotensi terlanda aliran lahar") && remark.includes("awan panas")) {
    return { color: "#A0522D", fillColor: "#A0522D", weight: 1, fillOpacity: 0.5 }; // Cokelat tanah
  }
  else if (remark.includes("berpotensi tinggi terhadap lontaran batu pijar")) {
    return { color: "#8A2BE2", fillColor: "#8A2BE2", weight: 1, fillOpacity: 0.5 }; // Ungu violet
  }
  else if (remark.includes("berpotensi tinggi terlanda awan panas")) {
    return { color: "#FF69B4", fillColor: "#FF69B4", weight: 1, fillOpacity: 0.5 }; // Pink terang
  }
  else if (remark.includes("berpotensi tertimpa lontaran batu pijar")) {
    return { color: "#32CD32", fillColor: "#32CD32", weight: 1, fillOpacity: 0.5 }; // Hijau lime
  }
  else if (remark.includes("berpotensi terlanda hujan abu lebat") && remark.includes("lontaran batu pijar")) {
    return { color: "#1E90FF", fillColor: "#1E90FF", weight: 1, fillOpacity: 0.5 }; // Biru dodger
  }
  else if (remark.includes("berpotensi terlanda aliran lahar")) {
    return { color: "#FF4500", fillColor: "#FF4500", weight: 1, fillOpacity: 0.5 }; // Oranye kemerahan
  }

 // Default fallback (tidak merah!)
  return { color: "#808080", fillColor: "#808080", weight: 1, fillOpacity: 0.3 }; // abu-abu
}

function styleJalur(f) { 
  return { color: "#FFA500", weight: 3, dashArray: "5,5" }; 
}

function styleTempat(f) { 
  return { color: "#008000", weight: 2, fillColor: "#00FF00", fillOpacity: 0.6 }; 
}

// === Popup Helper ===
function popupPersil(props) {
  if (!props) return "";
  var mapping = {
    "NAMOBJ": "Desa/Kelurahan",
    "WADMKC": "Kecamatan",
    "WADMKK": "Kabupaten/Kota",
    "Jumlah_Rumah": "Jumlah Bangunan Terdampak"
  };
  var html = "<table class='popup-table'>";
  Object.keys(mapping).forEach(key => {
    if (props[key] !== undefined) {
      html += `<tr><td class='popup-label'>${mapping[key]}</td><td>${props[key]}</td></tr>`;
    }
  });
  html += "</table>";
  return html;
}

function popupKRB(props) {
  if (!props) return "";
  var fields = ["FCODE", "THTERBIT", "KRB", "REMARK"];
  var html = "<table class='popup-table'>";
  fields.forEach(f => {
    if (props[f] !== undefined) {
      html += `<tr><td class='popup-label'>${f}</td><td>${props[f]}</td></tr>`;
    }
  });
  html += "</table>";
  return html;
}

function popupEvakuasi(props) {
  if (!props) return "";
  var mapping = { "WADMPK": "Provinsi", "WADMKK": "Kabupaten/Kota", "REMARK": "Lokasi" };
  var html = "<table class='popup-table'>";
  Object.keys(mapping).forEach(key => {
    if (props[key] !== undefined) {
      html += `<tr><td class='popup-label'>${mapping[key]}</td><td>${props[key]}</td></tr>`;
    }
  });
  html += "</table>";
  return html;
}

// === Layers ===
var persilLayer = L.geoJSON(null, { style: stylePersil, onEachFeature: (f, l) => l.bindPopup(popupPersil(f.properties)) });
var krbLayer = L.geoJSON(null, { style: styleKRB, onEachFeature: (f, l) => l.bindPopup(popupKRB(f.properties)) });
var jalurLayer = L.geoJSON(null, { style: styleJalur, onEachFeature: (f, l) => l.bindPopup(popupEvakuasi(f.properties)) });
var tempatLayer = L.geoJSON(null, { style: styleTempat, onEachFeature: (f, l) => l.bindPopup(popupEvakuasi(f.properties)) });

// === Load Data GeoJSON ===
fetch('../data/Persil_Desa.geojson').then(r => r.json()).then(d => { persilLayer.addData(d).addTo(map); });
fetch('../data/KRB_Full.geojson').then(r => r.json()).then(d => { krbLayer.addData(d).addTo(map); });
fetch('../data/J_Evakuasi_BWI.geojson').then(r => r.json()).then(d => { jalurLayer.addData(d); });
fetch('../data/J_Evakuasi_BWS.geojson').then(r => r.json()).then(d => { jalurLayer.addData(d); });
fetch('../data/T_Evakuasi_BWI.geojson').then(r => r.json()).then(d => { tempatLayer.addData(d); });
fetch('../data/T_Evakuasi_BWS.geojson').then(r => r.json()).then(d => { tempatLayer.addData(d); });

// === Marker Kearifan Lokal ===
var kearifanLayer = L.layerGroup();

var marker1 = L.marker([-8.024141322546003, 114.18145476023389]).bindPopup(` ... `);
var marker2 = L.marker([-7.9884384010113365, 114.17333930005388]).bindPopup(` ... `);
var marker3 = L.marker([-7.988535700674706, 114.17241499988876]).bindPopup(` ... `);
var marker4 = L.marker([-7.9927996004721775, 114.1929963000355]).bindPopup(` ... `);

marker1.addTo(kearifanLayer);
marker2.addTo(kearifanLayer);
marker3.addTo(kearifanLayer);
marker4.addTo(kearifanLayer);
kearifanLayer.addTo(map);

// === Toggle Layer ===
document.getElementById("persilCheck").addEventListener("change", function() {
  this.checked ? map.addLayer(persilLayer) : map.removeLayer(persilLayer);
});
document.getElementById("krbCheck").addEventListener("change", function() {
  this.checked ? map.addLayer(krbLayer) : map.removeLayer(krbLayer);
});
document.getElementById("kearifanCheck").addEventListener("change", function() {
  this.checked ? map.addLayer(kearifanLayer) : map.removeLayer(kearifanLayer);
});
document.getElementById("jalurCheck").addEventListener("change", function() {
  this.checked ? map.addLayer(jalurLayer) : map.removeLayer(jalurLayer);
});
document.getElementById("tempatCheck").addEventListener("change", function() {
  this.checked ? map.addLayer(tempatLayer) : map.removeLayer(tempatLayer);
});

// === Toggle Basemap ===
document.querySelectorAll("input[name=basemap]").forEach(radio => {
  radio.addEventListener("change", function() {
    if (this.value === "satelit") {
      map.addLayer(satellite); map.removeLayer(osm);
    } else {
      map.addLayer(osm); map.removeLayer(satellite);
    }
  });
});

// === Sidebar Toggle (Mobile) ===
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.querySelector(".sidebar-toggle");

if (toggleBtn && sidebar) {
  toggleBtn.textContent = sidebar.classList.contains("closed") ? "⬆️ Buka Menu" : "✖ Tutup";
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    toggleBtn.textContent = sidebar.classList.contains("closed") ? "⬆️ Buka Menu" : "✖ Tutup";
  });
}

const reopenBtn = document.querySelector(".sidebar-reopen");
if (reopenBtn) {
  reopenBtn.addEventListener("click", () => {
    sidebar.classList.remove("closed");
    toggleBtn.textContent = "✖ Tutup";
  });
}

// === Fitur Pencarian Lokasi ===
let searchLayer;

function searchLocation() {
  const query = document.getElementById("searchInput").value;
  if (!query) {
    alert("Ketik nama daerah dulu ya!");
    return;
  }

  fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        if (searchLayer) map.removeLayer(searchLayer);

        const result = data[0];
        const bbox = result.boundingbox;
        const bounds = [
          [parseFloat(bbox[0]), parseFloat(bbox[2])],
          [parseFloat(bbox[1]), parseFloat(bbox[3])]
        ];
        map.fitBounds(bounds);

        if (result.geojson) {
          searchLayer = L.geoJSON(result.geojson, {
            style: { color: "#ff7800", weight: 2, fillOpacity: 0.1 }
          }).addTo(map).bindPopup(`Hasil pencarian: ${query}`).openPopup();
        } else {
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          searchLayer = L.marker([lat, lon]).addTo(map)
            .bindPopup(`Hasil pencarian: ${query}`).openPopup();
        }
      } else {
        alert("Lokasi tidak ditemukan.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Gagal mencari lokasi.");
    });
}

const searchBtn = document.querySelector(".search-box button");
if (searchBtn && !searchBtn.getAttribute("onclick")) {
  searchBtn.addEventListener("click", searchLocation);
}

const searchInput = document.getElementById("searchInput");
if (searchInput && !searchInput.getAttribute("onkeypress")) {
  searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") searchLocation();
  });
}
