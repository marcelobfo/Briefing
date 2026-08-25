const http = require('http');

const payload = {
  companyName: "Tech Teste - Final Webhook",
  contactName: "Assistente IA",
  contactRole: "Testador Definitivo",
  contactEmail: "MarceloBFO@gmail.com",
  contactPhone: "11999998888",
  empresa_historia: "Enviando teste final para validar a rota exata: /webhook/briefing",
  publico_perfil: "Tudo ajustado e validado."
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
