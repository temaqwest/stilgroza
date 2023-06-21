import './style.css'
import './node_modules/ol/ol.css'
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {Icon, Style,} from 'ol/style.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {fromLonLat} from "ol/proj.js";

document.querySelector('#app').innerHTML = `
	<div class="logo">
		<img src="assets/lightning.png" alt="logo" class="logo__img">
		<span class="logo__title">
			<strong>Stil</strong><span class="orange">Groza</span>
		</span>
	</div>
	<div class="tools">
		<button class="tools__btn"><img src="assets/zoom-in.png" alt="zoom-in" id="zoom-in" class="tools__zoomin"></button>
		<button class="tools__btn"><img src="assets/zoom-out.png" alt="zoom-out" id="zoom-out" class="tools__zoomout"></button>
	</div>
    <div id="map" class="map"></div>
`

const center = [-5639523.95, -3501274.52];
const map = new Map({
	target: document.getElementById('map'),
	view: new View({
		center: center,
		zoom: 2,
		minZoom: 2,
		maxZoom: 19,
	}),
	layers: [
		new TileLayer({
			source: new XYZ({
				url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
				tileSize: 256,
			}),
		}),
	],
});

document.getElementById('zoom-out').onclick = function () {
	const view = map.getView();
	const zoom = view.getZoom();
	view.setZoom(zoom - 1);
};

document.getElementById('zoom-in').onclick = function () {
	const view = map.getView();
	const zoom = view.getZoom();
	view.setZoom(zoom + 1);
};


async function getLightnings() {
	const res = await fetch('http://localhost:5050/lightnings', {
		method: 'GET'
	})
	
	return res.json()
}

const createMarker = (lon, lat) => {
	const marker = new VectorLayer({
		source: new VectorSource({
			features: [
				new Feature({
					geometry: new Point(
						fromLonLat([lon, lat])
					)
				})
			]
		}),
		style: new Style({
			image: new Icon({
				width: 75,
				src: 'assets/lightning.png'
			})
		})
	})
	
	return marker
}

getLightnings().then((res) => {
	res.forEach((data) => {
		const marker = createMarker(data.longitude, data.latitude)
		
		map.addLayer(marker)
	})
})
