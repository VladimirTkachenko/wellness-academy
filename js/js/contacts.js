const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');

export function initContactMap() {
  try {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.warn('Map container not found');
      return;
    }
    const initialCoords = [49.9935, 36.2304];
    const map = L.map('map').setView(initialCoords, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(initialCoords)
      .addTo(map)
      .bindPopup('<b>WELLNESS ACADEMY</b><br>Kharkiv, 61157, Oleksandra Shpeyera St., 4')
      .openPopup();
  } catch (error) {
    console.error('Map initialization failed:', error);
  }
}

export function setupContactPage() {
  initContactMap();

  const currentYearElem = document.querySelector('#current-year');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }
}
