const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Clientes API',
            version: '1.0.0',
            description: 'API para controle dos dados cadastrais de Clientes.'
        },
        servers: [{url: 'http://localhost:' + PORT}]
    },
    apis: ['./app_routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(require('./app_routes/clienteRoute.js'));

app.listen(PORT, () => {
    console.log(`Express started on port ${PORT}`);
});
