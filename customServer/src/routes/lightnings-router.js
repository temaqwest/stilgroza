const Router = require('../../framework/Router');
const db = require('../database/index')

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

module.exports = router;
