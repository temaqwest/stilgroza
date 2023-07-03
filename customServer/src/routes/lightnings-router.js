const Router = require('../../framework/Router');
const db = require('../database/index')
const amqp = require('amqplib/callback_api')

const router = new Router();

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
router.get('/sse-lightnings', async (req, res) => {
    console.log('SSE GOES')
    res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    })


    let i = 1

    // setInterval(async () => {
    //     let data = await db('SELECT * from lightnings order by id desc limit 5;')
    //     await res.write(`event: message\nid: ${i}\nretry: 5000\ndata: ${JSON.stringify(data)}\n\n`)
    //
    //     i++
    // }, 5000)
    amqp.connect(`amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`, (err0, connection) => {
        if (err0) throw err0
        connection.createChannel((err1, channel) => {
            if (err1) throw err1
            const mainQueue = 'main'
            channel.assertQueue(mainQueue, {
                durable: false
            })
            channel.purgeQueue(mainQueue)

            channel.consume(mainQueue, async (msg) => {
                const content = await msg?.content
                console.log(content.toString('utf-8'))
                let data = await db('SELECT * from lightnings order by id desc limit 5;')
                await res.write(`event: message\nid: ${i}\nretry: 5000\ndata: ${JSON.stringify(data)}\n\n`)
                i++
            })
        })
    })
})

module.exports = router;
