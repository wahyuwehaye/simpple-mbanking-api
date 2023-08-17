const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const Redis = require('ioredis'); // Mengganti require('redis')

const app = express();
const port = 3000;

// Koneksi ke Redis menggunakan ioredis
const redisClient = new Redis();

// Middleware
app.use(bodyParser.json());

// Menggunakan rute API
app.use('/api', apiRoutes);

// Memeriksa koneksi Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Memeriksa koneksi MySQL
const db = require('./models/db');
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Mulai server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
