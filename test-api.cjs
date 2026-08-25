const http = require('http');

http.get('http://127.0.0.1:3000/api/briefings', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Body:", data);
  });
}).on("error", (err) => {
  console.log("Error:", err.message);
});
