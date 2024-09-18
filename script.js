// Credenciais pré-definidas para acesso aos resultados
const validId = 'admin123';
const validPassword = 'senhaSegura';

// Lista de CPFs válidos para login
const validCPFs = ['12345678900', '98765432100', '11122233300', '12312312300', '11111111100', ];

// Inicializar votos do localStorage
let votes = JSON.parse(localStorage.getItem('votes')) || {};

// Função de login
function login() {
    const cpf = document.getElementById('cpf').value;
    const message = document.getElementById('loginMessage');
    
    if (validCPFs.includes(cpf)) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userCPF', cpf); // Armazenar CPF do usuário
        window.location.href = 'vote.html';
    } else {
        message.textContent = 'CPF inválido.';
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userCPF');
    window.location.href = 'index.html';
}

// Função para verificar se o usuário está logado
function checkLogin() {
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
}

// Função para processar o voto
function vote(candidate) {
    if (localStorage.getItem('loggedIn') !== 'true') {
        alert('Você deve estar logado para votar.');
        return;
    }
    
    const userCPF = localStorage.getItem('userCPF');
    
    if (userCPF) {
        let votedCPFs = JSON.parse(localStorage.getItem('votedCPFs')) || {};

        if (votedCPFs[userCPF]) {
            // Se já votou, exibir mensagem
            showMessage('Você já votou.');
            return;
        }
        
        // Registra o voto
        if (!votes[candidate]) {
            votes[candidate] = 0;
        }
        votes[candidate]++;
        
        // Marcar o CPF como tendo votado
        votedCPFs[userCPF] = true;
        localStorage.setItem('votedCPFs', JSON.stringify(votedCPFs));
        localStorage.setItem('votes', JSON.stringify(votes)); // Salvar votos atualizados
        
        // Redirecionar para a página de agradecimento
        window.location.href = 'votou.html';
    }
}

// Função para login na página de resultados
function loginToResults() {
    const id = document.getElementById('id').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('resultMessage');

    if (id === validId && password === validPassword) {
        // Armazenar estado de login na sessionStorage
        sessionStorage.setItem('resultsLoggedIn', 'true');
        
        // Exibe os resultados se as credenciais forem válidas
        document.getElementById('loginResult').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        displayResults();  // Exibir os resultados
    } else {
        message.textContent = 'ID ou senha inválidos.';
    }
}

// Função para exibir resultados
function displayResults() {
    const votes = JSON.parse(localStorage.getItem('votes')) || {}; // Carregar votos do localStorage
    const resultDiv = document.getElementById('result');
    let resultHTML = '<h2>Resultados da Votação:</h2>';
    for (const candidate in votes) {
        resultHTML += `<p>${candidate}: ${votes[candidate]} votos</p>`;
    }
    resultDiv.innerHTML = resultHTML;
}

// Verificar login ao carregar a página de resultados
if (window.location.pathname.endsWith('resultados.html')) {
    if (sessionStorage.getItem('resultsLoggedIn') === 'true') {
        document.getElementById('loginResult').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        displayResults();  // Exibir os resultados automaticamente se já estiver logado
    }
}

// Função para exibir mensagens
function showMessage(message) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
    } else {
        alert(message);
    }
}

// Verificar login ao carregar a página de votação
if (window.location.pathname.endsWith('vote.html')) {
    checkLogin();
}


