const express = require('express');
const app = express();
app.use(express.json());

let votes = {};  // Armazena votos no servidor (substituir por banco de dados em produção)
let votedCPFs = {};  // Armazena CPFs que já votaram

// Rota para processar votos
app.post('/vote', (req, res) => {
    const { cpf, candidate } = req.body;

    // Verificar se o CPF já votou
    if (votedCPFs[cpf]) {
        return res.json({ success: false, message: 'Você já votou.' });
    }

    // Registra o voto
    if (!votes[candidate]) {
        votes[candidate] = 0;
    }
    votes[candidate]++;
    
    // Marcar o CPF como tendo votado
    votedCPFs[cpf] = true;
    
    res.json({ success: true });
});

// Rota para exibir resultados
app.get('/results', (req, res) => {
    res.json({ votes });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
