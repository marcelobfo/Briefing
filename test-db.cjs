const mysql = require('mysql2/promise');

async function test() {
  console.log("Tentando conectar ao banco com nova senha...");
  try {
    const pool = mysql.createPool({
      host: "95.217.181.123",
      user: "briefinglançament6o",
      password: "xMGi2CbDiAXCyGEd",
      database: "briefinglançament6o",
      port: 3306,
      connectTimeout: 5000,
    });
    
    const [result] = await pool.query(
      "INSERT INTO briefing_responses (company_name, contact_name, contact_email, contact_phone, responses_json) VALUES ('Teste Conexao OK', 'Marcelo Teste', 'teste@teste.com', '00000', '{}')"
    );
    console.log("SUCESSO! Inserido com ID:", result.insertId);
    process.exit(0);
  } catch (err) {
    console.error("FALHA:", err.message || err.code);
    process.exit(1);
  }
}

test();
