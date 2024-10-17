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
            color: 'white'
        }),
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        })
    })
});

var pointStyle1 = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: 'white'
        }),
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 2
        })
    })
});

var pointStyle2 = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: 'white'
        }),
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
        })
    })
});

var pointStyle3 = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: 'white'
        }),
        stroke: new ol.style.Stroke({
            color: 'orange',
            width: 2
        })
    })
});

var modal = document.getElementById("modal");
var span = document.getElementsByClassName("close")[0];

async function onFeatureClick(event) {
    var feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
        return feature;
    });

    if (feature) {
        var locationName = feature.get('nazev') || 'Neznámé místo';
        document.getElementById('location-name').textContent = locationName;
        document.getElementById('form-location-name').textContent = locationName;
        
		selected = locationName;
		
		await getData();
		
        // Zde můžete přidat kód pro načtení a zobrazení dalších informací o lokaci
        
        modal.style.display = "flex";
    }
}

async function getData() {
	let data = {"id": selected};
		console.log(data);
		
		try {
			const response = await fetch('/dostatRecenze', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				const result = await response.json();
				console.log(result);
				
				let list = document.getElementById("age-list");
				list.replaceChildren(); 
				
				if (result.averageVideno != undefined) {
					if (result.sortedAgeRanges[0].age != 0){
						console.log("b");
						if (document.getElementById("ageRange1")){
							console.log("brik");
							document.getElementById("ageRange1").innerHTML = result.sortedAgeRanges[0].age;
						} else {
							console.log("brikule");
							let newRange = document.createElement("li");
							newRange.setAttribute("id", "ageRange1");
							newRange.innerHTML = result.sortedAgeRanges[0].age;
							list.appendChild(newRange);
						}	
					}
					if (result.sortedAgeRanges[1].age != 0){
						if (document.getElementById("ageRange2")){
							document.getElementById("ageRange2").innerHTML = result.sortedAgeRanges[1].age;
						} else {
							let newRange = document.createElement("li");
							newRange.setAttribute("id", "ageRange2");
							newRange.innerHTML = result.sortedAgeRanges[1].age;
							list.appendChild(newRange);
						}
					}
					if (result.sortedAgeRanges[2].age != 0){
						if (document.getElementById("ageRange3")){
							document.getElementById("ageRange3").innerHTML = result.sortedAgeRanges[2].age;
						} else {
							let newRange = document.createElement("li");
							newRange.setAttribute("id", "ageRange3");
							newRange.innerHTML = result.sortedAgeRanges[2].age;
							list.appendChild(newRange);
						}
					}
					document.getElementById("overall-rating").innerHTML = result.averageVideno.toFixed(2);
				} else {
					console.log("no data");
				}
			} else {
				console.log('Failed sending rewiev!');
			}
		} catch (error) {
			console.error('Error:', error);
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

var geojsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://services6.arcgis.com/ogJAiK65nXL1mXAW/arcgis/rest/services/Hudební_kluby_a_festival_parky/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
        format: new ol.format.GeoJSON()
    }),
    style: pointStyle
});

map.addLayer(geojsonLayer);

var geojsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://services6.arcgis.com/ogJAiK65nXL1mXAW/arcgis/rest/services/Kina/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
        format: new ol.format.GeoJSON()
    }),
    style: pointStyle1
});

map.addLayer(geojsonLayer);

var geojsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://services6.arcgis.com/ogJAiK65nXL1mXAW/arcgis/rest/services/Letní_koupání/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
        format: new ol.format.GeoJSON()
    }),
    style: pointStyle2
});

map.addLayer(geojsonLayer);

var geojsonLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://services6.arcgis.com/ogJAiK65nXL1mXAW/arcgis/rest/services/Zábavní_centra/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
        format: new ol.format.GeoJSON()
    }),
    style: pointStyle3
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
			//modal.style.display = "none";  // Zavře modální okno po úspěšném odeslání
            // Zde můžete přidat kód pro aktualizaci zobrazených informací o lokaci
		} else {
			console.log('Failed sending rewiev!')
		}
	} catch (error) {
		console.error('Error:', error);
	}
	
	await getData();
}