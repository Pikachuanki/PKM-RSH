// ================= INIT MAP =================
var map = L.map("map").setView([-8.0, 114.18], 12);

// Basemap Satelit (default)
var satelit = L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  attribution: "Google Satellite",
}).addTo(map);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
});

// ================= LAYER PERSIL RUMAH =================
var persilLayer = new L.GeoJSON.AJAX("../data/Persil_Desa.geojson", {
  style: { color: "blue", weight: 1, fillOpacity: 0.4 },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.bindPopup("<b>Persil Rumah</b><br>ID: " + feature.properties.id);
    }
  },
});

// ================= LAYER KRB =================
var krbLayer = new L.GeoJSON.AJAX("../data/KRB_FULL.geojson", {
  style: { color: "red", weight: 1, fillOpacity: 0.2 },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.bindPopup("<b>KRB</b><br>Keterangan: " + feature.properties.nama);
    }
  },
});

// ================= LAYER JALUR EVAKUASI =================
var jalurBwi = new L.GeoJSON.AJAX("../data/J_Evakuasi_BWI.geojson", {
  style: { color: "green", weight: 2 },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.bindPopup("<b>Jalur Evakuasi</b>");
    }
  },
});
var jalurBws = new L.GeoJSON.AJAX("../data/J_Evakuasi_BWS.geojson", {
  style: { color: "green", weight: 2 },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.bindPopup("<b>Jalur Evakuasi</b>");
    }
  },
});
var jalurLayer = L.layerGroup([jalurBwi, jalurBws]);

// ================= LAYER TEMPAT EVAKUASI =================
var tempatBwi = new L.GeoJSON.AJAX("../data/T_Evakuasi_BWI.geojson", {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng).bindPopup("<b>Tempat Evakuasi</b>");
  },
});
var tempatBws = new L.GeoJSON.AJAX("../data/T_Evakuasi_BWS.geojson", {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng).bindPopup("<b>Tempat Evakuasi</b>");
  },
});
var tempatLayer = L.layerGroup([tempatBwi, tempatBws]);

// ================= LAYER KEARIFAN LOKAL (MARKER MANUAL) =================
var kearifanLayer = L.layerGroup();

var marker1 = L.marker([-8.024141322546003, 114.18145476023389]).bindPopup(`
  <div style="text-align:center;">
    <img src="../img/1.jpg" alt="Rokat Bumi Ijen" style="width:150px;">
    <h4>Rokat Bumi Ijen</h4>
    <table style="width:100%; text-align:left; font-size:12px;">
      <tr><td><b>Desa</b></td><td>Kalianyar</td></tr>
      <tr><td><b>Dusun</b></td><td>Kebon Jeruk</td></tr>
      <tr><td><b>Deskripsi</b></td><td>Rokat Bumi adalah ritual kebudayaan tahunan masyarakat Bondowoso...</td></tr>
    </table>
  </div>
`);
var marker2 = L.marker([-7.9884384010113365, 114.17333930005388]).bindPopup(`
  <div style="text-align:center;">
    <img src="../img/2.jpg" alt="Rokat Dhisa" style="width:150px;">
    <h4>Rokat Dhisa</h4>
    <table style="width:100%; text-align:left; font-size:12px;">
      <tr><td><b>Desa</b></td><td>Kalianyar</td></tr>
      <tr><td><b>Dusun</b></td><td>Blawan</td></tr>
      <tr><td><b>Deskripsi</b></td><td>Rokat Dhisa adalah ritual tahunan dalam tradisi masyarakat Madura...</td></tr>
    </table>
  </div>
`);
marker1.addTo(kearifanLayer);
marker2.addTo(kearifanLayer);

// ================= EVENT CHECKBOX LAYER =================
document.getElementById("persilCheck").addEventListener("change", function (e) {
  e.target.checked ? map.addLayer(persilLayer) : map.removeLayer(persilLayer);
});
document.getElementById("krbCheck").addEventListener("change", function (e) {
  e.target.checked ? map.addLayer(krbLayer) : map.removeLayer(krbLayer);
});
document.getElementById("jalurCheck").addEventListener("change", function (e) {
  e.target.checked ? map.addLayer(jalurLayer) : map.removeLayer(jalurLayer);
});
document.getElementById("tempatCheck").addEventListener("change", function (e) {
  e.target.checked ? map.addLayer(tempatLayer) : map.removeLayer(tempatLayer);
});
document.getElementById("kearifanCheck").addEventListener("change", function (e) {
  e.target.checked ? map.addLayer(kearifanLayer) : map.removeLayer(kearifanLayer);
});

// ================= BASMAP SWITCHER =================
document.querySelectorAll("input[name='basemap']").forEach(function (input) {
  input.addEventListener("change", function (e) {
    if (e.target.value === "satelit") {
      map.addLayer(satelit);
      map.removeLayer(osm);
    } else {
      map.addLayer(osm);
      map.removeLayer(satelit);
    }
  });
});

// ================= DEFAULT AKTIF =================
persilLayer.addTo(map);
krbLayer.addTo(map);
kearifanLayer.addTo(map);
