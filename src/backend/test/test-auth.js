const axios = require('axios');

// Configurações
const API_URL = 'http://localhost:3000';
const LOGIN_ENDPOINT = '/auth/login';
const ME_ENDPOINT = '/auth/@me';

// Credenciais de teste
const credentials = {
  email: 'alice.teste@example.com',
  password: 'senha123'
};

// Função para fazer login e obter token
async function login() {
  try {
    console.log('Tentando fazer login com:', credentials.email);
    const response = await axios.post(`${API_URL}${LOGIN_ENDPOINT}`, credentials);
    
    console.log('Login bem-sucedido!');
    console.log('Resposta do login:', JSON.stringify(response.data, null, 2));
    
    return response.data.token;
  } catch (error) {
    console.error('Erro ao fazer login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

// Função para acessar a rota protegida
async function getMe(token) {
  try {
    console.log('Tentando acessar rota protegida com token...');
    console.log('Token (primeiros 20 caracteres):', token.substring(0, 20) + '...');
    
    const response = await axios.get(`${API_URL}${ME_ENDPOINT}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Acesso à rota protegida bem-sucedido!');
    console.log('Dados do usuário:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Erro ao acessar rota protegida:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

// Função principal para executar o teste
async function runTest() {
  try {
    // Passo 1: Fazer login e obter token
    const token = await login();
    
    // Passo 2: Acessar rota protegida com o token
    const userData = await getMe(token);
    
    console.log('Teste completo com sucesso!');
    return { success: true, token, userData };
  } catch (error) {
    console.error('Teste falhou!');
    return { success: false, error: error.message };
  }
}

// Executar o teste
runTest()
  .then(result => {
    if (result.success) {
      console.log('✅ Teste de autenticação concluído com sucesso!');
    } else {
      console.log('❌ Teste de autenticação falhou!');
    }
  })
  .catch(err => {
    console.error('Erro inesperado durante o teste:', err);
  });