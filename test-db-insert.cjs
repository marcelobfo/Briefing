const mysql = require('mysql2/promise');

async function test() {
  try {
    const pool = mysql.createPool({
      host: "95.217.181.123",
      user: "briefinglançament6o",
      password: "xMGi2CbDiAXCyGEd",
      database: "briefinglançament6o",
      port: 3306,
    });
    
    // Check table structure
    const [columns] = await pool.query("SHOW COLUMNS FROM briefing_responses");
    console.log("Colunas atuais na tabela:", columns.length);
    console.log(columns.map(c => c.Field).join(', '));
    process.exit(0);
  } catch (err) {
    console.error("Erro DB:", err.message);
    process.exit(1);
  }
}

test();
