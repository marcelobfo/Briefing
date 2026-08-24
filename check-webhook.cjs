async function testWebhook(path) {
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://sites-clientes-n8n.stpanz.easypanel.host/webhook/${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "Verificando se a URL está ativa" }),
    });
    console.log(`URL: ${url} | Status: ${res.status}`);
  } catch (err) {
    console.log(`URL: ${url} | Erro:`, err.message);
  }
}
async function run() {
  await testWebhook("briefing");
  await testWebhook("briefing-clientes");
  await testWebhook("briefing%20clientes");
}
run();
