const fs = require('fs');
let content = fs.readFileSync('src/components/BriefingForm.tsx', 'utf-8');

// Add supabase import
if (!content.includes("import { supabase } from '../lib/supabase';")) {
    content = content.replace("import { ChevronRight, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';", "import { ChevronRight, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';\nimport { supabase } from '../lib/supabase';");
}

// Add handleKeyDown
if (!content.includes("const handleKeyDown = ")) {
    content = content.replace("const nextStep = () => {", `const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      if (currentStep < steps.length - 1) {
        nextStep();
      }
    }
  };

  const nextStep = () => {`);
}

// Replace form opening tag to include onKeyDown
content = content.replace('<form onSubmit={handleSubmit} className="bg-white/[0.03] border', '<form onKeyDown={handleKeyDown} onSubmit={handleSubmit} className="bg-white/[0.03] border');

// Replace handleSubmit
const submitStart = content.indexOf('const handleSubmit = async (e: React.FormEvent) => {');
const submitEnd = content.indexOf('if (isSuccess) {');

if (submitStart !== -1 && submitEnd !== -1) {
    const newSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Send direct to n8n Webhook
      try {
        await fetch('https://sites-clientes-n8n.stpanz.easypanel.host/webhook/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        console.log("Enviado direto para o n8n com sucesso!");
      } catch (webhookErr) {
        console.error("Erro no envio direto para n8n:", webhookErr);
      }

      // 2. Send direct to Supabase (bypassing backend)
      if (supabase) {
        try {
          const { error } = await supabase
            .from('briefing_responses')
            .insert([{
              company_name: formData.companyName || '',
              contact_name: formData.contactName || '',
              contact_role: formData.contactRole || '',
              contact_email: formData.contactEmail || '',
              contact_phone: formData.contactPhone || '',
              empresa_historia: formData.empresa_historia || '',
              empresa_missao: formData.empresa_missao || '',
              empresa_produtos_atuais: formData.empresa_produtos_atuais || '',
              empresa_socios: formData.empresa_socios || '',
              empresa_identidade_visual: formData.empresa_identidade_visual || '',
              produto_nome: formData.produto_nome || '',
              produto_descricao: formData.produto_descricao || '',
              produto_tipo: formData.produto_tipo || '',
              produto_problema: formData.produto_problema || '',
              produto_diferenciais: formData.produto_diferenciais || '',
              produto_mvp: formData.produto_mvp || '',
              produto_data_lancamento: formData.produto_data_lancamento || '',
              produto_tipo_lancamento: formData.produto_tipo_lancamento || '',
              publico_perfil: formData.publico_perfil || '',
              publico_relacao: formData.publico_relacao || '',
              publico_dores: formData.publico_dores || '',
              publico_personas: formData.publico_personas || '',
              publico_concorrentes: formData.publico_concorrentes || '',
              publico_concorrentes_analise: formData.publico_concorrentes_analise || '',
              publico_tamanho_mercado: formData.publico_tamanho_mercado || '',
              objetivos_selecao: JSON.stringify(formData.objetivos_selecao || []),
              objetivos_outros: formData.objetivos_outros || '',
              objetivos_metas: formData.objetivos_metas || '',
              objetivos_kpis: formData.objetivos_kpis || '',
              posicionamento_mensagem: formData.posicionamento_mensagem || '',
              posicionamento_tom: formData.posicionamento_tom || '',
              posicionamento_termos_obrigatorios: formData.posicionamento_termos_obrigatorios || '',
              posicionamento_termos_proibidos: formData.posicionamento_termos_proibidos || '',
              posicionamento_slogan: formData.posicionamento_slogan || '',
              posicionamento_referencias: formData.posicionamento_referencias || '',
              materiais_selecao: JSON.stringify(formData.materiais_selecao || []),
              materiais_outros: formData.materiais_outros || '',
              materiais_dominio: formData.materiais_dominio || '',
              materiais_site_anterior: formData.materiais_site_anterior || '',
              materiais_integracoes: formData.materiais_integracoes || '',
              materiais_conteudo_pronto: formData.materiais_conteudo_pronto || '',
              divulgacao_selecao: JSON.stringify(formData.divulgacao_selecao || []),
              divulgacao_outros: formData.divulgacao_outros || '',
              divulgacao_redes_atuais: formData.divulgacao_redes_atuais || '',
              divulgacao_verba: formData.divulgacao_verba || '',
              divulgacao_acoes_especiais: formData.divulgacao_acoes_especiais || '',
              prazos_deadline: formData.prazos_deadline || '',
              prazos_intermediarios: formData.prazos_intermediarios || '',
              prazos_orcamento_total: formData.prazos_orcamento_total || '',
              prazos_ferramentas_atuais: formData.prazos_ferramentas_atuais || '',
              acessos_selecao: JSON.stringify(formData.acessos_selecao || []),
              observacoes_adicionais: formData.observacoes_adicionais || '',
              observacoes_restricoes: formData.observacoes_restricoes || ''
            }]);
          if (error) console.error("Supabase insert error frontend:", error.message);
        } catch(e) {
          console.error("Supabase exception frontend:", e);
        }
      }

      // 3. Fallback: try sending to our /api just in case
      try {
        await fetch('/api/submit-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (err) {}
      
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Erro de conexão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  `;
    content = content.substring(0, submitStart) + newSubmit + content.substring(submitEnd);
}

fs.writeFileSync('src/components/BriefingForm.tsx', content, 'utf-8');
console.log("Replaced form submit logic and added onKeyDown");
