export async function getPlaceFromCoords(lon, lat) {
	const response = await fetch('https://api.opencagedata.com/geocode/v1/json?' +
		new URLSearchParams({ key: '3457027481a44624b4c0fa72d3748b01', q: `${lon},${lat}`, language: 'ru', pretty: 1 }),
		{
			method: 'GET'
		},
	)
	
	const json = await response.json()
	const formatted = json?.results[0]?.formatted
	
	if (!formatted) return 'unknown'
	
	return formatted
}
