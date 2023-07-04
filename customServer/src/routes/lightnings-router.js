const Router = require('../../framework/Router');
const db = require('../database/index')
const amqp = require('amqplib/callback_api')

const router = new Router();
let clients = [];
let facts = [];


/**
 * Get all lightnings
 */
router.get('/lightnings', async (req, res) => {
    const allLightnings = await db('SELECT * FROM lightnings')
    console.log(allLightnings)
    res.send(allLightnings);
})

/**
 * Create new lightning event
 */
router.post('/lightnings', async (req, res) => {
    let result = ''

    if (req.body.latitude && req.body.longitude) {
        const newLightning = {...req.body};
        result = await db(`
            INSERT INTO lightnings (latitude, longitude, time)
            VALUES (${newLightning.latitude}, ${newLightning.longitude},
            NOW());
        `)
    }
    
    res.send(result);
})

/**
 * Get lightning by ID
 */
router.get('/lightning', async (req, res) => {
    if (!req?.body?.id) return res.send('Lightning not found');
    
    const lightning = await db(`SELECT * FROM lightnings WHERE ID = ${req.body.id}`)
    res.send(lightning[0]);
})

/**
 * Get 5 last lightnings (Server - sent events)
 */
router.get('/sse-lightnings', sseHandler)

async function sseHandler(req, res) {
    console.log('SSE CONNECTED')

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    })

    let i = 1
    const example = {
        id: 507,
        latitude: -37.926868,
        longitude: -63.632813,
        time: '2023-07-04T11:39:43.045Z'
    };

    res.write(`event: message\nid: ${i}\nretry: 1000\ndata: ${JSON.stringify([example])}\n\n`)

    amqp.connect(`amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`, (err0, connection) => {
        if (err0) throw err0

        connection.createChannel((err1, channel) => {
            if (err1) throw err1

            const mainQueue = 'main'

            channel.assertQueue(mainQueue, {
                durable: false
            })

            channel.consume(mainQueue, async (msg) => {
                const content = await msg?.content
                console.log('GOT EVENT FROM RBMQ')
                console.log(content.toString('utf-8'))
                let data = await db('SELECT * FROM lightnings WHERE ID > (SELECT COUNT(*) FROM lightnings) - 5;')
                await res.write(`event: message\nid: ${i}\nretry: 1000\ndata: ${JSON.stringify(data)}\n\n`)
                console.log('DATABASE:', data)
                console.log('data was sent to user by sse')
                i++
            }, {noAck: true})
        })
    })

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        res
    };

    clients.push(newClient);

    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
}

module.exports = router;
