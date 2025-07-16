const express = require('express');
const routes = express.Router();

const {  addExpense, getAllExpenses,deleteExpense,updateExpense } = require('../controller/expensesController');
const authenticate = require('../middleware/authMiddleware');

routes.post('/expense', authenticate,addExpense);
routes.get('/expense', authenticate, getAllExpenses);
routes.delete('/expense/:id', authenticate, deleteExpense);
routes.put('/expense', authenticate, updateExpense);

module.exports = routes;