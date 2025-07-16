const app = require('./app');
const PORT = process.env.PORT
const db = require('./config/db');
db.db();

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});