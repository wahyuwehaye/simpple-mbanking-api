const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const userController = require('../controllers/userController');

// Create new transaction
router.post('/transactions', transactionController.createTransaction);

// Update transaction
router.put('/transactions/:id', transactionController.updateTransaction);

// Delete transaction
router.delete('/transactions/:id', transactionController.deleteTransaction);

// Get all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Get transactions by user ID
router.get('/transactions/user/:userId', transactionController.getTransactionsByUser);

// Get transactions by type (income or expense)
router.get('/transactions/type/:type', transactionController.getTransactionsByType);

// Get transactions by type (income or expense) and user ID
router.get('/transactions/type/:type/user/:userId', transactionController.getTransactionsByTypeAndUser);

// Get user information with balance and total expenses
router.get('/users/:id', userController.getUserInfo);

module.exports = router;
