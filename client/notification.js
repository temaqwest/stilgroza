const notification = document.querySelector('#notification')

export default function () {
	setTimeout(() => {
		notification.classList.add('notification--visible')
	}, 3000)
}
