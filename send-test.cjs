const http = require('http');

const payload = {
  companyName: "Tech Teste - IA",
  contactName: "Assistente IA",
  contactRole: "Testador Automático",
  contactEmail: "MarceloBFO@gmail.com",
  contactPhone: "11999998888",
  empresa_historia: "Esta é uma empresa de teste criada automaticamente pelo sistema para validar a integração do n8n, banco de dados e arquivos locais.",
  empresa_missao: "Testar tudo com sucesso.",
  produto_nome: "Super Produto Teste",
  produto_descricao: "Um produto incrível enviado via requisição de teste.",
  publico_perfil: "Pessoas que gostam de testes bem sucedidos.",
  objetivos_selecao: ["Vender mais", "Captar leads"],
  materiais_selecao: ["Site", "Instagram"],
  prazos_deadline: "30 dias",
  observacoes_adicionais: "Enviado automaticamente pelo terminal do servidor!"
};

const data = JSON.stringify(payload);

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/submit-briefing',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let responseBody = '';
  res.on('data', chunk => { responseBody += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${responseBody}`);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
