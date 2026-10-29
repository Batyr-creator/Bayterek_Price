const districtData = {
    'Есиль': { lat: 51.1283, lng: 71.4305, basePrice: 550000 },
    'Нура': { lat: 51.0950, lng: 71.4020, basePrice: 510000 },
    'Алматы': { lat: 51.1500, lng: 71.4700, basePrice: 460000 },
    'Сарыарка': { lat: 51.1700, lng: 71.4150, basePrice: 420000 },
    'Байконыр': { lat: 51.1850, lng: 71.4550, basePrice: 390000 }
};

let map, markers = {};

document.addEventListener('DOMContentLoaded', function() {
    map = L.map('map').setView([51.1400, 71.4300], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    Object.keys(districtData).forEach(name => {
        const data = districtData[name];
        const marker = L.marker([data.lat, data.lng]).addTo(map);
        marker.bindPopup(`<b>Район ${name}</b><br>Средняя цена: ~${data.basePrice.toLocaleString()} ₸/м²`);
        
        marker.on('click', () => {
            selectDistrict(name);
        });

        markers[name] = marker;
    });
});

function selectDistrict(name) {
    document.getElementById('district').value = name;

    document.querySelectorAll('.badge-district').forEach(el => {
        el.classList.toggle('active', el.textContent.trim() === name);
    });

    if (map && districtData[name]) {
        map.flyTo([districtData[name].lat, districtData[name].lng], 13);
        markers[name].openPopup();
    }
}

function syncDistrictFromSelect() {
    const selected = document.getElementById('district').value;
    selectDistrict(selected);
}

function calculatePrice(event) {
    event.preventDefault();

    const district = document.getElementById('district').value;
    const area = parseFloat(document.getElementById('area').value) || 0;
    const rooms = parseInt(document.getElementById('rooms').value) || 1;
    const floor = parseInt(document.getElementById('floor').value) || 1;
    const totalFloors = parseInt(document.getElementById('totalFloors').value) || 1;
    const year = parseInt(document.getElementById('year').value) || 2020;
    const condition = document.getElementById('condition').value;

    let baseRate = districtData[district] ? districtData[district].basePrice : 450000;

    let yearCoeff = 1.0;
    if (year >= 2020) yearCoeff = 1.15;
    else if (year >= 2010) yearCoeff = 1.05;
    else if (year >= 2000) yearCoeff = 0.95;
    else yearCoeff = 0.85;

    let conditionCoeff = 1.0;
    if (condition === 'черновая') conditionCoeff = 0.82;
    else if (condition === 'улучшенная черновая') conditionCoeff = 0.90;
    else if (condition === 'чистовая') conditionCoeff = 1.05;
    else if (condition === 'дизайнерский') conditionCoeff = 1.25;

    let floorCoeff = 1.0;
    if (floor === 1) floorCoeff = 0.93;
    else if (floor === totalFloors && totalFloors > 1) floorCoeff = 0.96;

    const finalRatePerMeter = Math.round(baseRate * yearCoeff * conditionCoeff * floorCoeff);
    const totalPrice = Math.round(finalRatePerMeter * area);

    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString('ru-RU') + ' ₸';
    document.getElementById('pricePerMeter').textContent = finalRatePerMeter.toLocaleString('ru-RU') + ' ₸ / м²';
    
    document.getElementById('summaryDetails').innerHTML = `
        • Район: <b>${district}</b> (модель Python)<br>
        • Площадь: <b>${area} м²</b> (${rooms}-комн.)<br>
        • Год: <b>${year}</b> | Этаж: <b>${floor}/${totalFloors}</b><br>
        • Состояние: <b>${condition}</b>
    `;

    document.getElementById('resultBox').style.display = 'block';
}
