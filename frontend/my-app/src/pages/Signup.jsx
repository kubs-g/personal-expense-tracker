import React, { useState } from "react";
import axios from "axios";
import './Signup.css'; 

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert(res.data.message);
    
      setFormData({ name: "", email: "", password: "" }); 
    } catch (err) {
      alert('faid to create the user:',err)
    }
  }

  return (
    <div className="signup-container"> 
      <h2 >Signup</h2>
      <form className="signup-form" onSubmit={handleSubmit} >
        <label >Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          
        />
        <label >Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          
        />
        <label >Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          required
          
        />
        <button type="submit" >Sign Up</button>
        
      </form>
    </div>
  );
}



export default Signup;
