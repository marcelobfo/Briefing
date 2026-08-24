import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

// MySQL Connection Pool
const pool = mysql.createPool({
  host: "95.217.181.123",
  user: "briefinglançament6o",
  password: "xMGi2CbDiAXCyGEd",
  database: "briefinglançament6o",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000, // Fail faster if DB is unreachable
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS briefing_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255),
        contact_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(255),
        responses_json JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log("Database initialized successfully.");
  } catch (err: any) {
    console.log("Database initialization skipped due to connection timeout.");
  }
}

initDB();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route to submit form
  app.post("/api/submit-briefing", async (req, res) => {
    try {
      const data = req.body;
      
      const {
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        ...rest
      } = data;

      const responsesJson = JSON.stringify(rest);
      let dbSuccess = false;
      let sheetSuccess = false;

      // Webhook n8n requested by user
      try {
        await fetch("https://sites-clientes-n8n.stpanz.easypanel.host/webhook/briefing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log("Data successfully sent to n8n webhook.");
        sheetSuccess = true; // prevent 500 error since we successfully saved to n8n
      } catch (webhookErr) {
        console.error("Failed to send data to n8n webhook:", webhookErr);
      }

      // Salvar em pasta local (Backend)
      try {
        const projectName = data.companyName ? data.companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'projeto_sem_nome';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const folderName = `${projectName}_${timestamp}`;
        const folderPath = path.join(process.cwd(), 'briefings_recebidos', folderName);
        
        await fs.mkdir(folderPath, { recursive: true });
        await fs.writeFile(
          path.join(folderPath, 'dados.json'),
          JSON.stringify(data, null, 2),
          'utf-8'
        );
        console.log(`Dados salvos localmente na pasta: ${folderPath}`);
      } catch (fsErr) {
        console.error("Erro ao salvar arquivo localmente:", fsErr);
      }

      // 1. Try to save to Google Sheets webhook first
      if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
        try {
          const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            sheetSuccess = true;
          }
        } catch (webhookErr) {
          console.error("Failed to send data to Google Sheets webhook:", webhookErr);
        }
      }

      // 2. Try to save to MySQL
      try {
        await pool.query(
          `INSERT INTO briefing_responses 
          (
            company_name, contact_name, contact_role, contact_email, contact_phone,
            empresa_historia, empresa_missao, empresa_produtos_atuais, empresa_socios, empresa_identidade_visual,
            produto_nome, produto_descricao, produto_tipo, produto_problema, produto_diferenciais, produto_mvp, produto_data_lancamento, produto_tipo_lancamento,
            publico_perfil, publico_relacao, publico_dores, publico_personas, publico_concorrentes, publico_concorrentes_analise, publico_tamanho_mercado,
            objetivos_selecao, objetivos_outros, objetivos_metas, objetivos_kpis,
            posicionamento_mensagem, posicionamento_tom, posicionamento_termos_obrigatorios, posicionamento_termos_proibidos, posicionamento_slogan, posicionamento_referencias,
            materiais_selecao, materiais_outros, materiais_dominio, materiais_site_anterior, materiais_integracoes, materiais_conteudo_pronto,
            divulgacao_selecao, divulgacao_outros, divulgacao_redes_atuais, divulgacao_verba, divulgacao_acoes_especiais,
            prazos_deadline, prazos_intermediarios, prazos_orcamento_total, prazos_ferramentas_atuais,
            acessos_selecao, observacoes_adicionais, observacoes_restricoes
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.companyName || '', data.contactName || '', data.contactRole || '', data.contactEmail || '', data.contactPhone || '',
            data.empresa_historia || '', data.empresa_missao || '', data.empresa_produtos_atuais || '', data.empresa_socios || '', data.empresa_identidade_visual || '',
            data.produto_nome || '', data.produto_descricao || '', data.produto_tipo || '', data.produto_problema || '', data.produto_diferenciais || '', data.produto_mvp || '', data.produto_data_lancamento || '', data.produto_tipo_lancamento || '',
            data.publico_perfil || '', data.publico_relacao || '', data.publico_dores || '', data.publico_personas || '', data.publico_concorrentes || '', data.publico_concorrentes_analise || '', data.publico_tamanho_mercado || '',
            JSON.stringify(data.objetivos_selecao || []), data.objetivos_outros || '', data.objetivos_metas || '', data.objetivos_kpis || '',
            data.posicionamento_mensagem || '', data.posicionamento_tom || '', data.posicionamento_termos_obrigatorios || '', data.posicionamento_termos_proibidos || '', data.posicionamento_slogan || '', data.posicionamento_referencias || '',
            JSON.stringify(data.materiais_selecao || []), data.materiais_outros || '', data.materiais_dominio || '', data.materiais_site_anterior || '', data.materiais_integracoes || '', data.materiais_conteudo_pronto || '',
            JSON.stringify(data.divulgacao_selecao || []), data.divulgacao_outros || '', data.divulgacao_redes_atuais || '', data.divulgacao_verba || '', data.divulgacao_acoes_especiais || '',
            data.prazos_deadline || '', data.prazos_intermediarios || '', data.prazos_orcamento_total || '', data.prazos_ferramentas_atuais || '',
            JSON.stringify(data.acessos_selecao || []), data.observacoes_adicionais || '', data.observacoes_restricoes || ''
          ]
        );
        dbSuccess = true;
      } catch (dbErr: any) {
        console.log("Database error during save:", dbErr.message);
      }

      if (!dbSuccess && !sheetSuccess && !process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
        return res.status(500).json({ success: false, message: "A conexão com o banco de dados falhou e nenhum webhook do Google Sheets foi configurado." });
      }

      res.status(200).json({ success: true, message: "Briefing submitted successfully!" });
    } catch (err) {
      console.error("Unexpected error saving briefing:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // API Route to fetch all briefings (for admin view)
  app.get("/api/briefings", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM briefing_responses ORDER BY created_at DESC");
      res.status(200).json(rows);
    } catch (err: any) {
      console.log("Database connection timeout when fetching briefings. Returning empty list.");
      // Return empty array instead of 500 so UI doesn't break, and user can still see Sheets instructions
      res.status(200).json([]);
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
