const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const helmet = require('helmet');
const router = require('./router/router');
const app = express();

require('dotenv').config();

const csrfProtection = csrf({ cookie: true, headerName: 'CSRF-Token'  });
const port = process.env.PORT || '3001';

app.set('trust proxy', "loopback");

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: [process.env.CLIENT_URI],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));

app.disable('x-powered-by');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  legacyHeaders: false, 
  handler: (req, res) => {
    res.status(429).json({
      status: "Error",
      message: 'Terlalu banyak permintaan dari IP ini. Coba lagi nanti.',
    });
  },
});

app.use(limiter);

app.use(cookieParser());

app.use((req, res, next) => {
  if (
    req.path !== '/csrf-token' &&
    req.method === 'GET' 
  ) {
    return next();
  }
  
  if(req.path === '/auth'){
    return next();
  }
  csrfProtection(req, res, next);
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
