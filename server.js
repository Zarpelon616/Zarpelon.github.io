const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'votacao'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// Rota para login de usuário
app.post('/login', (req, res) => {
    const { cpf } = req.body;
    const query = 'SELECT COUNT(*) AS count FROM usuarios WHERE cpf = ?';
    
    db.query(query, [cpf], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results[0].count > 0) {
            res.send({ success: true });
        } else {
            res.status(401).send({ success: false, message: 'CPF inválido.' });
        }
    });
});

// Rota para votação
app.post('/vote', (req, res) => {
    const { cpf, candidate } = req.body;
    
    const checkVoteQuery = 'SELECT COUNT(*) AS voted FROM votos WHERE cpf = ?';
    db.query(checkVoteQuery, [cpf], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results[0].voted > 0) {
            return res.status(400).send({ message: 'Você já votou.' });
        }
        
        const updateVoteQuery = 'INSERT INTO votos (cpf, candidato) VALUES (?, ?)';
        db.query(updateVoteQuery, [cpf, candidate], (err) => {
            if (err) return res.status(500).send(err);
            res.send({ success: true });
        });
    });
});

// Rota para obter resultados
app.get('/results', (req, res) => {
    const query = 'SELECT candidato, COUNT(*) AS votos FROM votos GROUP BY candidato';
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
