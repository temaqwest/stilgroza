const Router = require('../../framework/Router');
const db = require('../database/index')
const amqp = require('amqplib/callback_api')

const router = new Router();

router.get('/lightnings', async (req, res) => {
    const allLightnings = await db('SELECT * FROM lightnings')
    console.log(allLightnings)
    res.send(allLightnings);
})

router.post('/lightnings', async (req, res) => {
    let result = ''

    if (req.body.latitude && req.body.longitude) {
        const newLightning = {...req.body};
        result = await db(`
            INSERT INTO lightnings (latitude, longitude, time)
            VALUES (${Number(newLightning.latitude)}, ${Number(newLightning.longitude)},
            NOW());
        `)
    }
    
    res.send(result);
})

router.get('/lightning', async (req, res) => {
    if (!req?.body?.id) return res.send('Lightning not found');
    
    const lightning = await db(`SELECT * FROM lightnings WHERE ID = ${req.body.id}`)
    res.send(lightning[0]);
})

router.get('/sse-lightnings', async (req, res) => {
    res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    })
    
    let i = 1
    
    
    amqp.connect('amqp://test:password@192.168.201.25:5672', (err0, connection) => {
        if (err0) throw err0
        connection.createChannel((err1, channel) => {
            if (err1) throw err1
            const mainQueue = 'main'
            channel.assertQueue(mainQueue, {
                durable: false
            })
            channel.purgeQueue(mainQueue)
            
            channel.consume(mainQueue, async (msg) => {
                const content = await msg.content
                console.log(content.toString('utf-8'))
                
                let data = await db('SELECT * from lightnings order by id desc limit 5;')
                res.write(`event: message\nid: ${i}\nretry: 5000\ndata: ${JSON.stringify(data)}\n\n`)
    
                i++
            })
        })
    })
    
    // res.send();
})

module.exports = router;

// 192.165.65.82
