require('dotenv').config()

const PORT = process.env.PORT || 5000;
const Application = require('./framework/Application');

const jsonParser = require('./framework/middleware/parseJson');

const lightningsRouter = require('./src/routes/lightnings-router');

const app = new Application();

app.use(jsonParser);

app.addRouter(lightningsRouter);

app.listen(PORT, () => {
    console.log('Server successfully started on PORT ' + PORT);
});
