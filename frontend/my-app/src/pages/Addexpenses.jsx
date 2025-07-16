import React, { useState } from 'react';
import axios from 'axios';

function AddExpenses() {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        alert('You must be logged in to add expenses.');
        return;
      }
      const res = await axios.post('http://localhost:4000/api/auth/expense', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      setFormData({ amount: '', description: '', category: '' });
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default AddExpenses;
