// database.js

// Abre o banco de dados
const dbName = 'votacaoDB';
const dbVersion = 1; // Versão do banco de dados

let db;

// Inicializa o banco de dados
const openDatabase = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
        db = event.target.result;

        // Cria a tabela de usuários
        if (!db.objectStoreNames.contains('usuarios')) {
            db.createObjectStore('usuarios', { keyPath: 'cpf' });
        }

        // Cria a tabela de votos
        if (!db.objectStoreNames.contains('votos')) {
            const store = db.createObjectStore('votos', { keyPath: 'candidato' });
            store.createIndex('quantidade', 'quantidade', { unique: false });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onerror = (event) => {
        console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
    };
};

openDatabase();

// database.js

// Função para adicionar um usuário
const addUser = (cpf, nome) => {
    const transaction = db.transaction(['usuarios'], 'readwrite');
    const store = transaction.objectStore('usuarios');
    const request = store.put({ cpf, nome });

    request.onsuccess = () => {
        console.log('Usuário adicionado com sucesso.');
    };

    request.onerror = (event) => {
        console.error('Erro ao adicionar usuário:', event.target.errorCode);
    };
};

// Função para verificar CPF
const checkCPF = (cpf, callback) => {
    const transaction = db.transaction(['usuarios'], 'readonly');
    const store = transaction.objectStore('usuarios');
    const request = store.get(cpf);

    request.onsuccess = (event) => {
        callback(event.target.result !== undefined);
    };

    request.onerror = (event) => {
        console.error('Erro ao verificar CPF:', event.target.errorCode);
        callback(false);
    };
};

// Função para adicionar um voto
const addVote = (candidate) => {
    const transaction = db.transaction(['votos'], 'readwrite');
    const store = transaction.objectStore('votos');
    const request = store.get(candidate);

    request.onsuccess = (event) => {
        const data = event.target.result;
        if (data) {
            data.quantidade++;
            store.put(data);
        } else {
            store.put({ candidato: candidate, quantidade: 1 });
        }
    };

    request.onerror = (event) => {
        console.error('Erro ao adicionar voto:', event.target.errorCode);
    };
};

// Função para obter os resultados
const getResults = (callback) => {
    const transaction = db.transaction(['votos'], 'readonly');
    const store = transaction.objectStore('votos');
    const request = store.getAll();

    request.onsuccess = (event) => {
        callback(event.target.result);
    };

    request.onerror = (event) => {
        console.error('Erro ao obter resultados:', event.target.errorCode);
        callback([]);
    };
};
