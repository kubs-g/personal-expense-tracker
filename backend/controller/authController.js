const { pool, db } = require('../config/db.js'); 

const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const userExists = `SELECT * FROM users WHERE email = $1`;
      const existing = await pool.query(userExists, [email]);
  
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 2); 
  
      const newUser = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
      const result = await pool.query(newUser, [name, email, hashedPassword]);
  
      res.status(201).json({
        message: "User created successfully",
        user: result.rows[0],
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

const login =  (req,res)=>{
const {email, password} = req.body;
if(!email || !password){
    return res.status(400).json({message: "All fields are required"});
}
const userExists = `SELECT * FROM users WHERE email = $1`;
pool.query(userExists, [email], (error, results) => {
    if (error) {
        return res.status(500).json({message: "error checking if user exists"});
    }
    if (results.rows.length === 0) {
        return res.status(400).json({message: "User does not exist, please signup"});
    }
const user = results.rows[0];
const validPassword = bcrypt.compareSync(password, user.password);
if (!validPassword) {
    return res.status(400).json({message: "Password is incorrect"});
}
const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
);

res.status(200).json({
    message: "Login successful",
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email
    }
});
}
);
}



module.exports = { signup, login };

