const http = require('http');

const payload = {
  companyName: "Tech Teste - URL Corrigida",
  contactName: "Assistente IA",
  contactRole: "Testador de URL",
  contactEmail: "MarceloBFO@gmail.com",
  contactPhone: "11999998888",
  empresa_historia: "Testando envio com a nova URL do webhook (briefing%20clientes).",
  publico_perfil: "Tudo deve funcionar perfeitamente agora."
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
