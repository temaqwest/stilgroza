
export let eventSource;

export function start(callback) {
	eventSource = new EventSource('http://localhost:5050/sse-lightnings');
	
	eventSource.onopen = function(e) {
		console.log("Событие: open");
	};
	
	eventSource.onerror = function(e) {
		console.log(e)
		if (this.readyState == EventSource.CONNECTING) {
			console.log(`Переподключение`);
		} else {
			console.log("Произошла ошибка");
		}
	};
	
	eventSource.onmessage = callback
}

export function stop() {
	eventSource.close();
	console.log("Соединение закрыто");
}
