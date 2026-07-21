const express =require('express')
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'taskdb'
})

db.connect(err =>{
    if(err){
        console.log('db on',err)
    }else{
        console.log('db connected success')
    }
})

db.query('CREATE TABLE IF NOT EXISTS tasks(id INT PRIMARY KEY AUTO_INCREMENT,title VARCHAR(255),description VARCHAR(255))', (err,result)=>{
    if(err){
        console.log('table error',err)
    }else{
        console.log('table created',result)
    }   
})

// CREATE
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  db.query(
    "INSERT INTO tasks (title, description) VALUES (?, ?)",
    [title, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, title, description });
    }
  );
});

// READ
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// DELETE
app.delete("/tasks/:id", (req, res) => {
  db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});



app.listen(4000, ()=>{
    console.log('server is running')
})