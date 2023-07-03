import {getPlaceFromCoords} from "./positionStack.js";

const listContainer = document.querySelector('#lightnings-list')

export async function updateLightningsList(events = []) {
	const list = listContainer.querySelector('.lightnings-list__list')
	
	for (const event of events) {
		console.log(event)
		list.appendChild(await createListItem(event))
	}
}

async function createListItem(event) {
	const li = document.createElement('li')
	
	li.classList.add('lightnings-list__list-item')
	li.innerHTML = `
		 <strong>${await getPlaceFromCoords(event.longitude, event.latitude)}</strong> - ${new Date(event.time).toDateString()}`
	return li
}
