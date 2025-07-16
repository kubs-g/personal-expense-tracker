import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert(res.data.message);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('Name', res.data.user.name); 
      setFormData({ email: '', password: '' });
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className='login-form' onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
export default Login;