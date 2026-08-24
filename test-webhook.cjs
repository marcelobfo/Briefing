async function testWebhook() {
  try {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch("https://sites-clientes-n8n.stpanz.easypanel.host/webhook/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "Isso é um teste do terminal" }),
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch (err) {
    console.log("Webhook error:", err.message);
  }
}
testWebhook();
