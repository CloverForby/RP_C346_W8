const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
}

const app = express();

app.use(express.json());

app.listen(port, ()=> {
    console.log('Server running on port', port)
});

app.get('/allRoles', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.classes');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server Error getting all classes'})
    }
})

app.post('/addRole', async (req,res) => {
    const {className, classSubtitle, classPrimary, classSaves, classDie, classIcon} = req.body
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(`INSERT INTO classes (name, subtitle, primary, saves, die, icon) VALUES (?,?, ?,? , ? , ?)`,[className, classSubtitle, classPrimary, classSaves, classDie, classIcon]);
        res.status(201).json({message: `class ${className} added successfully`})
    } catch (err){
        console.error(err)
        res.status(500).json({message: `Server error - could not add new class ${className}`})
    }
})

app.delete('/deleteRole', async (req,res) => {
    try {
        const {classId} = req.body;
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(`DELETE FROM classes WHERE id=${classId}`);
        res.status(201).json({message: `class id ${classId} deleted successfully`})
    } catch (err){
        console.error(err)
        res.status(500).json({message: `Server error - could not remove class id ${classId}`})
    }
    
})

app.put('/updateRole', async (req,res) => {
    try {
        const {classId, className, classSubtitle, classPrimary, classSaves, classDie, classIcon} = req.body
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(`UPDATE classes SET name=${className},subtitle=${classSubtitle}, primary=${classPrimary}, saves=${classSaves}, die=${classDie}, icon=${classIcon} WHERE id=${classId}`)
        res.status(201).json({message: `class ${className} updated successfully`})
    } catch (err){
        console.error(err)
        res.status(500).json({message: `Server error - could not update class ${className}`})
    }
})