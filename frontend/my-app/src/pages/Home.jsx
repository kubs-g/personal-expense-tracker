import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import './Home.css'; 
function Home() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("Name") || "Guest";
  const token = localStorage.getItem("token"); 
 
 if(!token) {
    console.log("No token found, redirecting to login");
    
 }
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/auth/expense", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenses(res.data.expenses);
        console.log("Expenses fetched:", res.data.expenses);
 
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };

    fetchExpenses();
    
  }, [token]);

  
  const handleUpdate = async (expense) => {
    const newAmount = prompt("Enter new amount:", expense.amount);
    const newDescription = prompt("Enter new description:", expense.description);
    const newCategory = prompt("Enter new category:", expense.category);
  
    if (!newAmount || !newDescription || !newCategory) {
      alert("All fields are required.No update made");
      return;
    }
  
    try {
      await axios.put("http://localhost:4000/api/auth/expense", {
        id: expense.id, 
        amount: newAmount,
        description: newDescription,
        category: newCategory,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === expense.id
            ? { ...e, amount: newAmount, description: newDescription, category: newCategory }
            : e
        )
      );
  
      alert("Expense updated successfully");
    } catch (err) {
      console.error("Failed to update expense", err);
      alert("Failed to update expense");
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/auth/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(expenses.filter((e) => e.id !== id)); 
      alert("Expense deleted successfully");
    } catch (err) {
      console.error("Failed to delete expense", err);
      alert("Failed to delete expense");
    }
  };
  
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Expense Tracker</h1>
        <div className="auth-buttons">
          <button onClick={() => navigate("/Signup")}>Signup</button>
          <button onClick={() => navigate("/Login")}>Login</button>
        </div>
      </div>
  
      <p className="welcome-text">
        Hello, <strong>{userName}</strong>! Manage your spending and stay on top of your finances.
      </p>
  
      <div className="chart-section">
        <h2>Expense Chart</h2>
        <div className="chart-wrapper">
          {expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenses}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No expenses found. Add some to see them here!</p>
          )}
        </div>
      </div>
  
      <div className="expense-list-section">
        <div className="expense-header">
          <h2>Your Expenses</h2>
          <button onClick={() => navigate("/addexpenses")}>Add Expense</button>
        </div>
        <ul className="expense-list">
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <li key={index} className="expense-item">
                <div>
                  <div className="expense-category">{expense.category}: ${expense.amount}</div>
                  <div>{expense.description}</div>
                  <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
                </div>
                <div className="expense-actions">
                  <button className="edit-btn" onClick={() => handleUpdate(expense)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(expense.id)}>Delete</button>
                </div>
              </li>
            ))
          ) : (
            <p>No expenses recorded yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
  
 
}

export default Home;
