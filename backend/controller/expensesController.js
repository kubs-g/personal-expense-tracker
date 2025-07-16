const { pool, db } = require('../config/db.js'); 
const cors = require('cors');


//  add an expense

const addExpense = (req,res)=>{
    const {  amount, description, category  } = req.body;
    const date = new Date();
    const userId = req.user.id; 
    if ( !userId ||!amount || !description || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = `INSERT INTO expenses (user_id, amount, description, category) VALUES ($1, $2, $3, $4) RETURNING *`;
    pool.query(newExpense, [userId, amount, description, category ], (error, results) => {
        if (error) {
            console.error("Error adding expense:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(201).json({
            message: "Expense added successfully",
            expense: results.rows[0],
        });
    });
}

// get all expenses for a user

const getAllExpenses = (req, res) => {
const userId = req.user.id; 
    const getExpenses = `SELECT * FROM expenses WHERE user_id = $1 ORDER BY user_id`;
pool.query(getExpenses, [userId], (error, results) => {
        if (error) {
            console.error("Error fetching expenses:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({
            message: "Expenses fetched successfully",
            expenses: results.rows,
        });
    });
}

//update expenses for a user
const updateExpense = (req, res) => {
    const { id, amount, description, category } = req.body;
    const userId = req.user.id; 

    if (!id || !amount || !description || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const updateQuery = `UPDATE expenses SET amount = $1, description = $2, category = $3 WHERE id = $4 AND user_id = $5 RETURNING *`;
    pool.query(updateQuery, [amount, description, category, id, userId], (error, results) => {
        if (error) {
            console.error("Error updating expense:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({
            message: "Expense updated successfully",
            expense: results.rows[0],
        });
    });
}
//  delete an expense
const deleteExpense = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    if (!id) {
        return res.status(400).json({ message: "Expense ID is required" });
    }

    const deleteQuery = `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *`;
    pool.query(deleteQuery, [id, userId], (error, results) => {
        if (error) {
            console.error("Error deleting expense:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({
            message: "Expense deleted successfully",
            expense: results.rows[0],
        });
    });
}


module.exports = {
    addExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
};