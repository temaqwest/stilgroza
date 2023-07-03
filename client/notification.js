const notification = document.querySelector('#notification')

export function toggleNotification() {
	notification.classList.add('notification--visible')
	
	setTimeout(() => {
		notification.classList.remove('notification--visible')
	}, 3000)
}
