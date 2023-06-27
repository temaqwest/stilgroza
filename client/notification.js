const notification = document.querySelector('#notification')

export default function () {
	notification.classList.add('notification--visible')
	
	setTimeout(() => {
		notification.classList.remove('notification--visible')
	}, 3000)
}
