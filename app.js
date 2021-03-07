const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/orders');
const app = express();
//use route
app.use('api/products',productsRoute);
app.use('api/users',usersRoute);



app.use(cors({
    origin:"*",
    methods:['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders:'content-Type, Authorization, Origin, x-Requested, Accept',
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



module.exports = app;
