import './style.css'
import {toggleNotification} from './notification'
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
import {defaults as defaultControls} from 'ol/control.js';
import ZoomSlider from 'ol/control/ZoomSlider.js';
import {updateLightningsList} from "./lightningsList.js";


document.addEventListener('DOMContentLoaded', () => {
	/**
	 * OpenLayers setup
	 * @type {*[]}
	 */
	let markers = []
	const center = [-5639523.95, -3501274.52];
	const map = new Map({
		target: document.getElementById('map'),
		view: new View({
			center: center,
			zoom: 2,
			minZoom: 2,
			maxZoom: 19,
		}),
		controls: defaultControls().extend([new ZoomSlider()]),
		layers: [
			new TileLayer({
				source: new XYZ({
					url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
					tileSize: 256,
				}),
			}),
		],
	});


// Setup additional controls
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
	
	document.getElementById('extent-all').onclick = function () {
		extentAll(markers)
	};
	
	function extentAll(markers = []) {
		let fPair = []
		let sPair = []
		
		markers.forEach((marker) => {
			const [x1, y1, x2, y2] = marker.getSource().getExtent()
			fPair.push(x1, x2)
			sPair.push(y1, y2)
		})
		
		const allSources = [
			Math.min(...fPair),
			Math.min(...sPair),
			Math.max(...fPair),
			Math.max(...sPair)
		]
		
		map.getView().fit(allSources,  {
			size: map.getSize(),
			padding: [50, 50, 50, 50],
			duration: 3100
		});
	}
	
	const createMarker = (lon, lat) => {
		return new VectorLayer({
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
	}
	
	function clearAllMarkers() {
		markers.forEach(layer => {
			map.removeLayer(layer);
		});
		markers = []
	}
	
	
	/**
	 * Lightnings subscription
	 * @type {EventSource}
	 */
	
	const eventSourceInstance = new EventSource('//localhost:5050/sse-lightnings')
	
	eventSourceInstance.onerror = function(e) {
		if (this.readyState == EventSource.CONNECTING) {
			console.log(`Переподключение [SSE]`);
		} else {
			console.log("Произошла ошибка [SSE]");
		}
	};
	
	eventSourceInstance.onmessage = function(res) {
		clearAllMarkers()
		console.log({markers: markers, response: JSON.parse(res.data)})

		const data = JSON.parse(res.data)
		toggleNotification()
		updateLightningsList(data)
		
		data.forEach((data) => {
			const marker = createMarker(data.longitude, data.latitude)
			map.addLayer(marker)
			markers.push(marker)
		})
		
		extentAll(markers)
	}
	
})
