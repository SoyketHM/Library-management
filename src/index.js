const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const options = require('./config/swagger.json');
const app = express();
const db = require('./db/db');
const logger = require('morgan');
const helmet = require("helmet");
const routes = require('./routes');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');
const {createAdmin} = require('./helpers/create_admin')
const cors = require('cors');

require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/api', auth.jwt);
app.use(errorHandler);
app.use(logger('dev'));
app.use(helmet());
app.use(routes);
createAdmin();

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}...`);
});

