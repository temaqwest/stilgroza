const { Client } = require('pg')

async function getPGInfo() {
	try {
		const client = new Client({
			database: 'stilgroza',
			host: 'localhost',
			port: 5432,
			user: 'postgres',
			password: 'password'
		})
		
		await client.connect()
		
		const res = await client.query('SELECT * FROM lightnings')
		console.log(res.rows[0])
		console.log('Успешно')
		await client.end()
	} catch (err) {
		console.error('Problem executing export query:');
		console.error(err);
		throw err;
	}
}

getPGInfo()
