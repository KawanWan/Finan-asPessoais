const express = require('express');
const path = require('path');
const mysql = require("mysql2");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({path: './.env' });

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect( (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL Connected...");
    }
});

const publicDiretory = path.join(__dirname,'./public');
app.use(express.static(publicDiretory));

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.use(express.json());
app.use(cookieParser());

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send('Token não fornecido.');

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido.');

        req.userId = decoded.userId;
        next();
    });
}

//Definindo Rotas
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const users = [];

// app.get('/users', verifyJWT, (req, res) => {
//     res.json(users)
// });

// app.post('/login', async (req, res) => {
//     const user = users.find(user => user.name === req.body.name);
//     if(user == null){
//         return res.status(400).send('Não foi possível encontrar o usuário!');
//     }

//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             const token = jwt.sign({userId: user.userId}, process.env.SECRET, { expiresIn: 300 });
//             res.json({ auth: true, token })
//         } else {
//             res.send('Senha incorreta')
//         }
//     } catch {
//         res.status(500).send();
//     }
// });

app.listen(3000);