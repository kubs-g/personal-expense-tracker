const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./Routes/authRoute');
const expenseRoutes = require('./Routes/expenseRoutes');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/auth', expenseRoutes);

module.exports = app