import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const steps = [
  { id: 0, title: 'Dados do Cliente' },
  { id: 1, title: 'Sobre a Empresa' },
  { id: 2, title: 'Sobre o Produto/Serviço' },
  { id: 3, title: 'Público-Alvo e Mercado' },
  { id: 4, title: 'Objetivos do Lançamento' },
  { id: 5, title: 'Posicionamento e Comunicação' },
  { id: 6, title: 'Site e Materiais Digitais' },
  { id: 7, title: 'Canais de Divulgação' },
  { id: 8, title: 'Prazos e Orçamento' },
  { id: 9, title: 'Acessos e Observações' }
];

export default function BriefingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State for all form fields
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    
    // 1. Empresa
    empresa_historia: '',
    empresa_missao: '',
    empresa_produtos_atuais: '',
    empresa_socios: '',
    empresa_identidade_visual: '',
    
    // 2. Produto
    produto_nome: '',
    produto_descricao: '',
    produto_tipo: '',
    produto_problema: '',
    produto_diferenciais: '',
    produto_mvp: '',
    produto_data_lancamento: '',
    produto_tipo_lancamento: '',
    
    // 3. Público
    publico_perfil: '',
    publico_relacao: '',
    publico_dores: '',
    publico_personas: '',
    publico_concorrentes: '',
    publico_concorrentes_analise: '',
    publico_tamanho_mercado: '',
    
    // 4. Objetivos
    objetivos_selecao: [] as string[],
    objetivos_outros: '',
    objetivos_metas: '',
    objetivos_kpis: '',
    
    // 5. Posicionamento
    posicionamento_mensagem: '',
    posicionamento_tom: '',
    posicionamento_termos_obrigatorios: '',
    posicionamento_termos_proibidos: '',
    posicionamento_slogan: '',
    posicionamento_referencias: '',
    
    // 6. Materiais
    materiais_selecao: [] as string[],
    materiais_outros: '',
    materiais_dominio: '',
    materiais_site_anterior: '',
    materiais_integracoes: '',
    materiais_conteudo_pronto: '',
    
    // 7. Divulgação
    divulgacao_selecao: [] as string[],
    divulgacao_outros: '',
    divulgacao_redes_atuais: '',
    divulgacao_verba: '',
    divulgacao_acoes_especiais: '',
    
    // 8. Prazos
    prazos_deadline: '',
    prazos_intermediarios: '',
    prazos_orcamento_total: '',
    prazos_ferramentas_atuais: '',
    
    // 9. Acessos e 10. Observações
    acessos_selecao: [] as string[],
    observacoes_adicionais: '',
    observacoes_restricoes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (group: string, value: string) => {
    setFormData(prev => {
      const current = prev[group as keyof typeof prev] as string[];
      if (current.includes(value)) {
        return { ...prev, [group]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [group]: [...current, value] };
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      if (currentStep < steps.length - 1) {
        nextStep();
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 text-green-600 p-6 rounded-full mb-6"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-4">Briefing Enviado com Sucesso!</h2>
        <p className="text-lg text-gray-600 max-w-lg">
          Obrigado por preencher o documento. Nossos especialistas analisarão os detalhes e entrarão em contato em breve para dar início ao seu projeto de lançamento.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-light tracking-tight text-white">
            Passo {currentStep + 1} de {steps.length}
          </h2>
          <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
            {steps[currentStep].title}
          </span>
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div onKeyDown={handleKeyDown} className="bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* Step 0: Dados do Cliente */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">Dados do Cliente</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Nome da empresa / marca *</label>
                      <input type="text" name="companyName" required value={formData.companyName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="Sua Empresa" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Responsável pelo preenchimento *</label>
                      <input type="text" name="contactName" required value={formData.contactName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="Seu Nome" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Cargo / função *</label>
                      <input type="text" name="contactRole" required value={formData.contactRole} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="Diretor, CEO, Especialista..." />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">E-mail de contato *</label>
                      <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="email@empresa.com" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Telefone / WhatsApp *</label>
                      <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Sobre a Empresa */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">1. Sobre a Empresa</h3>
                  <p className="text-white/40 text-sm mb-6">Contexto geral do negócio que está por trás do lançamento.</p>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual é a história da empresa e há quanto tempo ela atua no mercado?</label>
                    <textarea name="empresa_historia" value={formData.empresa_historia} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual é a missão, visão e valores da empresa (se já definidos)?</label>
                    <textarea name="empresa_missao" value={formData.empresa_missao} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quais produtos ou serviços a empresa já oferece hoje, além do que será lançado?</label>
                    <textarea name="empresa_produtos_atuais" value={formData.empresa_produtos_atuais} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quem são os sócios/gestores e qual o papel de cada um no projeto?</label>
                    <textarea name="empresa_socios" value={formData.empresa_socios} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">A empresa já possui identidade visual (logo, cores, fontes) definida?</label>
                    <input type="text" name="empresa_identidade_visual" value={formData.empresa_identidade_visual} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="Sim/Não. Especifique brevemente." />
                  </div>
                </div>
              )}

              {/* Step 2: Produto/Serviço */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">2. Sobre o Produto ou Serviço</h3>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual é o nome (ou nome provisório) do produto/serviço?</label>
                    <input type="text" name="produto_nome" value={formData.produto_nome} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Descreva em poucas frases o que é e o que ele faz/resolve.</label>
                    <textarea name="produto_descricao" value={formData.produto_descricao} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">É um produto físico, digital, um serviço ou uma combinação?</label>
                    <input type="text" name="produto_tipo" value={formData.produto_tipo} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual problema específico do cliente ele resolve?</label>
                    <textarea name="produto_problema" value={formData.produto_problema} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quais são os principais diferenciais em relação a soluções semelhantes já existentes?</label>
                    <textarea name="produto_diferenciais" value={formData.produto_diferenciais} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual é a data prevista para o lançamento oficial?</label>
                      <input type="text" name="produto_data_lancamento" value={formData.produto_data_lancamento} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="DD/MM/AAAA ou Mês/Ano" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">O lançamento será único (big bang) ou faseado?</label>
                      <input type="text" name="produto_tipo_lancamento" value={formData.produto_tipo_lancamento} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Público-Alvo */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">3. Público-Alvo e Mercado</h3>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quem é o cliente ideal? (idade, gênero, localização, renda, profissão)</label>
                    <textarea name="publico_perfil" value={formData.publico_perfil} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Esse público já é cliente da empresa ou é um público novo a ser conquistado?</label>
                    <input type="text" name="publico_relacao" value={formData.publico_relacao} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quais são as principais dores, desejos e objeções desse público?</label>
                    <textarea name="publico_dores" value={formData.publico_dores} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quem são os principais concorrentes diretos e indiretos?</label>
                    <textarea name="publico_concorrentes" value={formData.publico_concorrentes} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">O que os concorrentes fazem bem? E mal?</label>
                    <textarea name="publico_concorrentes_analise" value={formData.publico_concorrentes_analise} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                </div>
              )}

              {/* Step 4: Objetivos */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">4. Objetivos do Lançamento</h3>
                  
                  <div className="mb-6">
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-4 block">Marque os objetivos prioritários:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Gerar reconhecimento de marca (awareness)',
                        'Captar leads / lista de espera',
                        'Vender diretamente na data de lançamento',
                        'Validar o produto/serviço no mercado',
                        'Atrair investidores ou parceiros',
                        'Fidelizar base de clientes existente'
                      ].map(obj => (
                        <label key={obj} className="flex items-center space-x-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            checked={formData.objetivos_selecao.includes(obj)}
                            onChange={() => handleCheckboxChange('objetivos_selecao', obj)}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-[12px] text-white/80 font-mono">{obj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Outro objetivo? (Opcional)</label>
                    <input type="text" name="objetivos_outros" value={formData.objetivos_outros} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quais são as metas numéricas do lançamento? (ex: nº de leads, vendas, faturamento)</label>
                    <textarea name="objetivos_metas" value={formData.objetivos_metas} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                </div>
              )}

              {/* Step 5: Posicionamento */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">5. Posicionamento e Comunicação</h3>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual mensagem principal deve ficar na cabeça do público?</label>
                    <textarea name="posicionamento_mensagem" value={formData.posicionamento_mensagem} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual é o tom de voz da marca? (formal, descontraído, técnico, inspirador...)</label>
                    <input type="text" name="posicionamento_tom" value={formData.posicionamento_tom} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Palavras/temas que DEVEM ser usados:</label>
                      <textarea name="posicionamento_termos_obrigatorios" value={formData.posicionamento_termos_obrigatorios} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Palavras/temas PROIBIDOS:</label>
                      <textarea name="posicionamento_termos_proibidos" value={formData.posicionamento_termos_proibidos} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Há um slogan ou call-to-action já definido?</label>
                    <input type="text" name="posicionamento_slogan" value={formData.posicionamento_slogan} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                </div>
              )}

              {/* Step 6: Materiais */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">6. Site, Landing Page e Materiais</h3>
                  
                  <div className="mb-6">
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-4 block">Marque os materiais necessários:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Landing page de captura (pré-lançamento)',
                        'Landing page de vendas',
                        'Site institucional completo',
                        'Página de produto em site existente',
                        'E-mail marketing / sequência',
                        'Integração com CRM (Kommo, HubSpot)',
                        'Automação de notificações',
                        'Checkout / integração de pagamento'
                      ].map(mat => (
                        <label key={mat} className="flex items-center space-x-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            checked={formData.materiais_selecao.includes(mat)}
                            onChange={() => handleCheckboxChange('materiais_selecao', mat)}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-[12px] text-white/80 font-mono">{mat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">A empresa já possui domínio e hospedagem? Informe se houver.</label>
                    <input type="text" name="materiais_dominio" value={formData.materiais_dominio} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Quais integrações são necessárias? (CRM, WhatsApp, Planilhas, Pagamento...)</label>
                    <textarea name="materiais_integracoes" value={formData.materiais_integracoes} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                </div>
              )}

              {/* Step 7: Canais */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">7. Canais de Divulgação</h3>
                  
                  <div className="mb-6">
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-4 block">Quais canais serão usados?</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        'Instagram', 'Facebook', 'TikTok', 'YouTube',
                        'LinkedIn', 'Google Ads', 'Meta Ads', 'E-mail marketing',
                        'WhatsApp', 'Influenciadores', 'Assessoria', 'Eventos'
                      ].map(canal => (
                        <label key={canal} className="flex items-center space-x-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            checked={formData.divulgacao_selecao.includes(canal)}
                            onChange={() => handleCheckboxChange('divulgacao_selecao', canal)}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-[12px] text-white/80 font-mono">{canal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">A empresa já possui redes sociais ativas? Quais e quantos seguidores?</label>
                    <textarea name="divulgacao_redes_atuais" value={formData.divulgacao_redes_atuais} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Existe verba definida para tráfego pago? Qual o valor total?</label>
                    <input type="text" name="divulgacao_verba" value={formData.divulgacao_verba} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                </div>
              )}

              {/* Step 8: Prazos e Orçamento */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">8. Prazos e Orçamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual é o prazo final (deadline) para estar no ar?</label>
                      <input type="text" name="prazos_deadline" value={formData.prazos_deadline} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="DD/MM/AAAA" />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Qual é o orçamento total disponível para o projeto?</label>
                      <input type="text" name="prazos_orcamento_total" value={formData.prazos_orcamento_total} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" placeholder="R$ 0,00" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Existem datas intermediárias importantes (ex: pré-venda, evento)?</label>
                    <textarea name="prazos_intermediarios" value={formData.prazos_intermediarios} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Já existem ferramentas contratadas (CRM, E-mail marketing)?</label>
                    <input type="text" name="prazos_ferramentas_atuais" value={formData.prazos_ferramentas_atuais} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                  </div>
                </div>
              )}

              {/* Step 9: Acessos e Observações */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-light tracking-tight text-white mb-6">9. Acessos e Observações Finais</h3>
                  
                  <div className="mb-6">
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-4 block">O que já pode ser disponibilizado para a equipe?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Logotipo em alta resolução',
                        'Manual de marca',
                        'Fotos e vídeos oficiais',
                        'Acesso ao domínio',
                        'Acesso à hospedagem',
                        'Acesso às redes sociais',
                        'Acesso ao Google Analytics/Tag Manager',
                        'Acesso ao CRM atual',
                        'Lista de contatos existente'
                      ].map(acesso => (
                        <label key={acesso} className="flex items-center space-x-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            checked={formData.acessos_selecao.includes(acesso)}
                            onChange={() => handleCheckboxChange('acessos_selecao', acesso)}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-[12px] text-white/80 font-mono">{acesso}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Existe algo importante não perguntado acima que precisamos saber?</label>
                    <textarea name="observacoes_adicionais" value={formData.observacoes_adicionais} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block">Há alguma restrição legal ou regulatória na comunicação?</label>
                    <textarea name="observacoes_restricoes" value={formData.observacoes_restricoes} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"></textarea>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white/[0.02] px-8 py-6 border-t border-white/5 flex justify-between items-center">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${
              currentStep === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-white/80 hover:bg-white/10 bg-white/5 border border-white/10 shadow-sm'
            }`}
          >
            <ChevronLeft size={20} className="mr-1" />
            Anterior
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-2.5 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98]"
            >
              Próximo
              <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2.5 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Briefing'}
              {!isSubmitting && <Send size={18} className="ml-2" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
