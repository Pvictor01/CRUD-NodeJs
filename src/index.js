const express = require('express');

const app = express();

const routes = require('./routes/user.route');

app.use(express.json());

app.use(routes);

app.listen(2000);