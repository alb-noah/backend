const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/orders');
const app = express();
const productsRouter = require('./routes/products');

//use route
// Import Routes

app.use(cors({
    origin:"*",
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders:'content-Type, Authorization, Origin, x-Requested, Accept',
}));
app.use('/api/products', productsRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
