const db = require('../models/db');
const Redis = require('ioredis'); // Mengimpor ioredis

// Get user information with balance and total expenses
exports.getUserInfo = (req, res) => {
  const userId = req.params.id;

  // Membuat koneksi Redis menggunakan ioredis
  const redisClient = new Redis();

  // Fetch data from Redis cache
  redisClient.get(userId, (redisErr, cachedData) => {
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      console.log('get data from cache');
    } else {
      const sql = 'SELECT users.id, name, address, ' +
                  'SUM(CASE WHEN type="income" THEN amount ELSE 0 END) AS total_income, ' +
                  'SUM(CASE WHEN type="expense" THEN amount ELSE 0 END) AS total_expense ' +
                  'FROM users ' +
                  'LEFT JOIN transactions ON users.id = transactions.user_id ' +
                  'WHERE users.id = ? ' +
                  'GROUP BY users.id';
      db.query(sql, [userId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'An error occurred while fetching user information' });
        } else {
          const userData = {
            id: result[0].id,
            name: result[0].name,
            address: result[0].address,
            balance: result[0].total_income - result[0].total_expense,
            expense: result[0].total_expense
          };

          // Set data in Redis cache
          redisClient.setex(userId, 3600, JSON.stringify(userData)); // Cache for 1 hour
          res.json(userData);
          console.log('add new data to cache');
        }
      });
    }
  });
};
