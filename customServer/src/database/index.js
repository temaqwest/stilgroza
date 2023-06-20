const { Client } = require('pg')

async function dbQuery(query) {
	try {
		const client = new Client({
			database: process.env.DB_NAME,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
		})
		
		await client.connect()
		const res = await client.query(query)
		client.end()
		
		return res.rows
	} catch (err) {
		console.error('Problem executing query: ');
		console.error(err);
		throw err;
	}
}

module.exports = dbQuery
