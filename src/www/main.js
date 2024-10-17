var kralovehradeckyKrajExtent = ol.proj.transformExtent([15.1, 50.0, 16.6, 50.85], 'EPSG:4326', 'EPSG:3857');

let selected = undefined;

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=8YRNEfnZb0K6syftXksQ'
            })
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([15.48, 50.24]),
        zoom: 9,
        extent: kralovehradeckyKrajExtent,
        minZoom: 8,
        maxZoom: 18
    })
});

function constrainView(event) {
    var view = event.map.getView();
    var center = view.getCenter();
    var currentExtent = view.calculateExtent(map.getSize());
    var boundingExtent = kralovehradeckyKrajExtent;

    if (!ol.extent.containsExtent(boundingExtent, currentExtent)) {
        var newCenter = [
            Math.max(Math.min(center[0], boundingExtent[2]), boundingExtent[0]),
            Math.max(Math.min(center[1], boundingExtent[3]), boundingExtent[1])
        ];
        view.setCenter(newCenter);
    }
}

map.on('moveend', constrainView);

var pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: 'red'
        }),
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 2
        })
    })
});

var modal = document.getElementById("modal");
var span = document.getElementsByClassName("close")[0];

function onFeatureClick(event) {
    var feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
        return feature;
    });

    if (feature) {
        var locationName = feature.get('nazev') || 'Neznámé místo';
        document.getElementById('location-name').textContent = locationName;
        document.getElementById('form-location-name').textContent = locationName;
        
        // Zde můžete přidat kód pro načtení a zobrazení dalších informací o lokaci
        
        modal.style.display = "flex";
    }
}

// Zavření modálního okna při kliknutí na křížek
span.onclick = function() {
    modal.style.display = "none";
}

// Zavření modálního okna při kliknutí mimo okno
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

map.on('singleclick', onFeatureClick);

// ... (zbytek kódu zůstává stejný)

async function formSubmition(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    data.locationName = document.getElementById('form-location-name').textContent;

    try {
        const response = await fetch('/pridatRecenzi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Review sent.');
            modal.style.display = "none";  // Zavře modální okno po úspěšném odeslání
            // Zde můžete přidat kód pro aktualizaci zobrazených informací o lokaci
        } else {
            console.log('Failed sending review!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

var geojsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://services6.arcgis.com/ogJAiK65nXL1mXAW/arcgis/rest/services/Kina/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
        format: new ol.format.GeoJSON()
    }),
    style: pointStyle
});

map.addLayer(geojsonLayer);

map.on('singleclick', onFeatureClick);

// Vytvoření overlay pro tooltip
var tooltipElement = document.createElement('div');
tooltipElement.className = 'tooltip';
var tooltip = new ol.Overlay({
    element: tooltipElement,
    offset: [0, 40],
    positioning: 'bottom-center'
});
map.addOverlay(tooltip);

// Přidání posluchačů událostí pro zobrazení/skrytí tooltipu
map.on('pointermove', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
    });

    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        tooltip.setPosition(coordinates);
        tooltipElement.innerHTML = feature.get('nazev') || 'Neznámý bod';
        tooltipElement.style.display = 'block';
    } else {
        tooltipElement.style.display = 'none';
    }
});

map.on('mouseout', function() {
    tooltipElement.style.display = 'none';
});



async function formSubmition(event) {
	event.preventDefault();
	if (selected == undefined){
		console.log("Place not selected!");
		alert("Označte místo.");
		return;
	}
	
	const formData = new FormData(event.target);
	let data = Object.fromEntries(formData.entries());
	data["id"] = selected;

	try {
		const response = await fetch('/pridatRecenzi', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (response.ok) {
			const result = await response.json();
			console.log('Rewiev sent.')
		} else {
			console.log('Failed sending rewiev!')
		}
	} catch (error) {
		console.error('Error:', error);
	}
}