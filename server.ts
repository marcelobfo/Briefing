import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseKey) {
  try {
    // Ensure URL is a valid HTTP/HTTPS URL to prevent app crashes
    if (supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://")) {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log("Supabase client initialized successfully.");
    } else {
      console.warn("Supabase initialization skipped: supabaseUrl is not a valid HTTP/HTTPS URL.");
    }
  } catch (err: any) {
    console.error("Failed to initialize Supabase client:", err.message);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route to submit form
  app.post("/api/submit-briefing", async (req, res) => {
    try {
      const data = req.body;
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
        sheetSuccess = true;
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

      // 2. Try to save to Supabase
      if (supabase) {
        try {
          const { error } = await supabase
            .from('briefing_responses')
            .insert([{
              company_name: data.companyName || '',
              contact_name: data.contactName || '',
              contact_role: data.contactRole || '',
              contact_email: data.contactEmail || '',
              contact_phone: data.contactPhone || '',
              empresa_historia: data.empresa_historia || '',
              empresa_missao: data.empresa_missao || '',
              empresa_produtos_atuais: data.empresa_produtos_atuais || '',
              empresa_socios: data.empresa_socios || '',
              empresa_identidade_visual: data.empresa_identidade_visual || '',
              produto_nome: data.produto_nome || '',
              produto_descricao: data.produto_descricao || '',
              produto_tipo: data.produto_tipo || '',
              produto_problema: data.produto_problema || '',
              produto_diferenciais: data.produto_diferenciais || '',
              produto_mvp: data.produto_mvp || '',
              produto_data_lancamento: data.produto_data_lancamento || '',
              produto_tipo_lancamento: data.produto_tipo_lancamento || '',
              publico_perfil: data.publico_perfil || '',
              publico_relacao: data.publico_relacao || '',
              publico_dores: data.publico_dores || '',
              publico_personas: data.publico_personas || '',
              publico_concorrentes: data.publico_concorrentes || '',
              publico_concorrentes_analise: data.publico_concorrentes_analise || '',
              publico_tamanho_mercado: data.publico_tamanho_mercado || '',
              objetivos_selecao: JSON.stringify(data.objetivos_selecao || []),
              objetivos_outros: data.objetivos_outros || '',
              objetivos_metas: data.objetivos_metas || '',
              objetivos_kpis: data.objetivos_kpis || '',
              posicionamento_mensagem: data.posicionamento_mensagem || '',
              posicionamento_tom: data.posicionamento_tom || '',
              posicionamento_termos_obrigatorios: data.posicionamento_termos_obrigatorios || '',
              posicionamento_termos_proibidos: data.posicionamento_termos_proibidos || '',
              posicionamento_slogan: data.posicionamento_slogan || '',
              posicionamento_referencias: data.posicionamento_referencias || '',
              materiais_selecao: JSON.stringify(data.materiais_selecao || []),
              materiais_outros: data.materiais_outros || '',
              materiais_dominio: data.materiais_dominio || '',
              materiais_site_anterior: data.materiais_site_anterior || '',
              materiais_integracoes: data.materiais_integracoes || '',
              materiais_conteudo_pronto: data.materiais_conteudo_pronto || '',
              divulgacao_selecao: JSON.stringify(data.divulgacao_selecao || []),
              divulgacao_outros: data.divulgacao_outros || '',
              divulgacao_redes_atuais: data.divulgacao_redes_atuais || '',
              divulgacao_verba: data.divulgacao_verba || '',
              divulgacao_acoes_especiais: data.divulgacao_acoes_especiais || '',
              prazos_deadline: data.prazos_deadline || '',
              prazos_intermediarios: data.prazos_intermediarios || '',
              prazos_orcamento_total: data.prazos_orcamento_total || '',
              prazos_ferramentas_atuais: data.prazos_ferramentas_atuais || '',
              acessos_selecao: JSON.stringify(data.acessos_selecao || []),
              observacoes_adicionais: data.observacoes_adicionais || '',
              observacoes_restricoes: data.observacoes_restricoes || ''
            }]);
          
          if (error) {
            console.error("Supabase insert error:", error.message);
          } else {
            console.log("Supabase insert success!");
            dbSuccess = true;
          }
        } catch (dbErr: any) {
          console.log("Database error during save:", dbErr.message);
        }
      }

      if (!dbSuccess && !sheetSuccess && !process.env.GOOGLE_SHEETS_WEBHOOK_URL && !supabase) {
        return res.status(500).json({ success: false, message: "Conexões falharam e Supabase não configurado." });
      }

      res.status(200).json({ success: true, message: "Briefing submitted successfully!" });
    } catch (err) {
      console.error("Unexpected error saving briefing:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // API Route to fetch all briefings (for admin view)
  app.get("/api/briefings", async (req, res) => {
    if (!supabase) {
      console.log("Supabase not configured. Returning empty list.");
      return res.status(200).json([]);
    }

    try {
      const { data, error } = await supabase
        .from('briefing_responses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      res.status(200).json(data || []);
    } catch (err: any) {
      console.log("Database connection error when fetching briefings:", err.message);
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
