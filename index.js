const { Client } = require('pg')

async function getPGInfo() {
	try {
		const client = new Client({
			database: 'postgres',
			host: 'localhost',
			port: 5432,
			user: 'postgres',
			password: 'root'
		})
		
		await client.connect()
		
		// const res = await client.query(`SELECT * FROM lightnings`, (err, res) => {
		// 	if (err) {
		// 		console.error(err)
		// 	} else {
		// 		console.log(res.rows)
		// 	}
		// })
		
		await client.end()
	} catch (err) {
		console.error('Problem executing export query:');
		console.error(err);
		throw err;
	}
}

getPGInfo()
