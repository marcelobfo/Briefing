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
    
    console.log("Dropping old table...");
    await pool.query("DROP TABLE IF EXISTS briefing_responses");
    
    console.log("Creating new table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS briefing_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255),
        contact_name VARCHAR(255),
        contact_role VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(255),
        empresa_historia TEXT,
        empresa_missao TEXT,
        empresa_produtos_atuais TEXT,
        empresa_socios TEXT,
        empresa_identidade_visual TEXT,
        produto_nome VARCHAR(255),
        produto_descricao TEXT,
        produto_tipo VARCHAR(255),
        produto_problema TEXT,
        produto_diferenciais TEXT,
        produto_mvp VARCHAR(255),
        produto_data_lancamento VARCHAR(255),
        produto_tipo_lancamento VARCHAR(255),
        publico_perfil TEXT,
        publico_relacao TEXT,
        publico_dores TEXT,
        publico_personas TEXT,
        publico_concorrentes TEXT,
        publico_concorrentes_analise TEXT,
        publico_tamanho_mercado VARCHAR(255),
        objetivos_selecao TEXT,
        objetivos_outros TEXT,
        objetivos_metas TEXT,
        objetivos_kpis TEXT,
        posicionamento_mensagem TEXT,
        posicionamento_tom TEXT,
        posicionamento_termos_obrigatorios TEXT,
        posicionamento_termos_proibidos TEXT,
        posicionamento_slogan VARCHAR(255),
        posicionamento_referencias TEXT,
        materiais_selecao TEXT,
        materiais_outros TEXT,
        materiais_dominio VARCHAR(255),
        materiais_site_anterior VARCHAR(255),
        materiais_integracoes TEXT,
        materiais_conteudo_pronto TEXT,
        divulgacao_selecao TEXT,
        divulgacao_outros TEXT,
        divulgacao_redes_atuais TEXT,
        divulgacao_verba VARCHAR(255),
        divulgacao_acoes_especiais TEXT,
        prazos_deadline VARCHAR(255),
        prazos_intermediarios TEXT,
        prazos_orcamento_total VARCHAR(255),
        prazos_ferramentas_atuais TEXT,
        acessos_selecao TEXT,
        observacoes_adicionais TEXT,
        observacoes_restricoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("Success! Table recreated with 53 columns.");
    process.exit(0);
  } catch (err) {
    console.error("Erro DB:", err.message);
    process.exit(1);
  }
}

test();
