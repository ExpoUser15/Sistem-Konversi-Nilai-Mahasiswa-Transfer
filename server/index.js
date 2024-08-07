const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const router = require('./router/router');
const app = express();

require('dotenv').config();

const port = process.env.PORT || '3001';

app.use(cors({
  origin: [process.env.CLIENT_URI],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

app.listen(port, () => {
  console.log('Server Running on Port 3000');
});
