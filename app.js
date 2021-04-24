const express = require('express');
const dotenv = require('dotenv');
const logger = require('tracer').colorConsole();
const {setMongo} = require('./mongo');
const {setRoutes} = require('./routes');

const app = express();
dotenv.config();
app.set('port', (process.env.PORT || 3000));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function main() {
  try {
    await setMongo();
    setRoutes(app);
    app.listen(app.get('port'), () => logger.log(`ExpressJs Authentication app is listening on port ${app.get('port')}`));
  } catch (err) {
    console.error(err);
  }
};

main();

module.exports = { app };