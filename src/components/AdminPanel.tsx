import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import html2pdf from 'html2pdf.js';
import { Download, RefreshCw, Database, FileSpreadsheet, Lock, ChevronDown, ChevronUp, User, Building, Mail, Phone, Calendar } from 'lucide-react';

const BriefingCard = ({ b }: { b: any }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById(`briefing-content-${b.id}`);
    if (!element) return;
    
    // Create a temporary clone for printing to force light mode and remove interactive elements if needed,
    // but the easiest is just printing the dark theme as is.
    const opt = {
      margin:       10,
      filename:     `Briefing-${b.company_name || 'Empresa'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0a0c10' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
      <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value, fullWidth = false }: { label: string, value: string | null | undefined, fullWidth?: boolean }) => {
    if (!value || value === '[]' || value === '') return null;
    
    let displayValue = value;
    try {
      if (value.startsWith('[')) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) displayValue = parsed.join(', ');
      }
    } catch (e) {
      // Keep original value if not valid JSON
    }

    return (
      <div className={fullWidth ? "col-span-1 md:col-span-2" : ""}>
        <span className="block text-white/40 text-xs mb-1">{label}</span>
        <span className="text-white text-sm whitespace-pre-wrap">{displayValue}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#12141a] border border-white/10 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
      <div 
        className="p-6 cursor-pointer hover:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <Building size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{b.company_name || 'Empresa não informada'}</h3>
            <div className="flex items-center text-xs text-white/40 mt-1 gap-3">
              <span className="flex items-center gap-1"><User size={12}/> {b.contact_name}</span>
              <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(b.created_at).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleDownloadPdf} className="flex items-center text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full transition-colors mr-2">
            <Download size={14} className="mr-1" /> PDF
          </button>
          <span className="bg-white/10 text-white/70 text-xs font-semibold px-3 py-1 rounded-full hidden sm:inline-block">
            ID: {b.id}
          </span>
          {expanded ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
        </div>
      </div>

      {expanded && (
        <div id={`briefing-content-${b.id}`} className="p-6 border-t border-white/10 bg-[#0a0c10]">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <User className="text-white/40" size={16} />
              <div>
                <span className="block text-white/40 text-xs">Cargo</span>
                <span className="text-white text-sm">{b.contact_role || '-'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-white/40" size={16} />
              <div>
                <span className="block text-white/40 text-xs">E-mail</span>
                <span className="text-white text-sm">{b.contact_email || '-'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-white/40" size={16} />
              <div>
                <span className="block text-white/40 text-xs">Telefone</span>
                <span className="text-white text-sm">{b.contact_phone || '-'}</span>
              </div>
            </div>
          </div>

          <Section title="1. Sobre a Empresa">
            <Field label="História" value={b.empresa_historia} fullWidth />
            <Field label="Missão/Valores" value={b.empresa_missao} fullWidth />
            <Field label="Produtos Atuais" value={b.empresa_produtos_atuais} fullWidth />
            <Field label="Sócios/Estrutura" value={b.empresa_socios} />
            <Field label="Identidade Visual" value={b.empresa_identidade_visual} />
          </Section>

          <Section title="2. Produto/Serviço">
            <Field label="Nome do Produto" value={b.produto_nome} />
            <Field label="Tipo" value={b.produto_tipo} />
            <Field label="Descrição" value={b.produto_descricao} fullWidth />
            <Field label="Problema que Resolve" value={b.produto_problema} fullWidth />
            <Field label="Diferenciais" value={b.produto_diferenciais} fullWidth />
            <Field label="É um MVP?" value={b.produto_mvp} />
            <Field label="Data de Lançamento" value={b.produto_data_lancamento} />
            <Field label="Tipo de Lançamento" value={b.produto_tipo_lancamento} />
          </Section>

          <Section title="3. Público-Alvo">
            <Field label="Perfil Geral" value={b.publico_perfil} fullWidth />
            <Field label="Relação Atual" value={b.publico_relacao} fullWidth />
            <Field label="Dores/Desejos" value={b.publico_dores} fullWidth />
            <Field label="Personas Específicas" value={b.publico_personas} fullWidth />
            <Field label="Concorrentes" value={b.publico_concorrentes} />
            <Field label="Análise de Concorrentes" value={b.publico_concorrentes_analise} />
            <Field label="Tamanho do Mercado" value={b.publico_tamanho_mercado} />
          </Section>

          <Section title="4. Objetivos">
            <Field label="Objetivos Selecionados" value={b.objetivos_selecao} fullWidth />
            <Field label="Outros Objetivos" value={b.objetivos_outros} />
            <Field label="Metas Numéricas" value={b.objetivos_metas} />
            <Field label="KPIs Importantes" value={b.objetivos_kpis} fullWidth />
          </Section>

          <Section title="5. Posicionamento">
            <Field label="Mensagem Principal" value={b.posicionamento_mensagem} fullWidth />
            <Field label="Tom de Voz" value={b.posicionamento_tom} fullWidth />
            <Field label="Termos Obrigatórios" value={b.posicionamento_termos_obrigatorios} />
            <Field label="Termos Proibidos" value={b.posicionamento_termos_proibidos} />
            <Field label="Slogan/Tagline" value={b.posicionamento_slogan} />
            <Field label="Referências/Inspirações" value={b.posicionamento_referencias} fullWidth />
          </Section>

          <Section title="6. Materiais Digitais">
            <Field label="Materiais Necessários" value={b.materiais_selecao} fullWidth />
            <Field label="Outros Materiais" value={b.materiais_outros} />
            <Field label="Domínio" value={b.materiais_dominio} />
            <Field label="Site Anterior" value={b.materiais_site_anterior} />
            <Field label="Ferramentas/Integrações" value={b.materiais_integracoes} />
            <Field label="Conteúdo Pronto" value={b.materiais_conteudo_pronto} fullWidth />
          </Section>

          <Section title="7. Divulgação">
            <Field label="Canais de Divulgação" value={b.divulgacao_selecao} fullWidth />
            <Field label="Outros Canais" value={b.divulgacao_outros} />
            <Field label="Redes Atuais" value={b.divulgacao_redes_atuais} />
            <Field label="Verba de Mídia" value={b.divulgacao_verba} />
            <Field label="Ações Especiais" value={b.divulgacao_acoes_especiais} fullWidth />
          </Section>

          <Section title="8. Prazos e Orçamento">
            <Field label="Deadline Final" value={b.prazos_deadline} />
            <Field label="Orçamento Total" value={b.prazos_orcamento_total} />
            <Field label="Prazos Intermediários" value={b.prazos_intermediarios} fullWidth />
            <Field label="Ferramentas Contratadas" value={b.prazos_ferramentas_atuais} fullWidth />
          </Section>

          <Section title="9. Acessos e 10. Observações">
            <Field label="Acessos Disponíveis" value={b.acessos_selecao} fullWidth />
            <Field label="Observações Adicionais" value={b.observacoes_adicionais} fullWidth />
            <Field label="Restrições" value={b.observacoes_restricoes} fullWidth />
          </Section>

        </div>
      )}
    </div>
  );
};

export default function AdminPanel() {
  const [briefings, setBriefings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const fetchBriefings = async () => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('briefing_responses')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && !error) {
          setBriefings(data);
          return;
        }
      }
      
      // Fallback
      const res = await fetch('/api/briefings');
      if (res.ok) {
        const data = await res.json();
        setBriefings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBriefings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#12141a] border border-white/10 rounded-2xl shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-white/5 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white/40" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
          <p className="text-white/40 mt-2">Área de gestão de briefings</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha de acesso" 
              className="w-full px-4 py-3 bg-[#0a0c10] text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-500 transition-colors">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Briefings Recebidos</h1>
          <p className="text-white/40 mt-2 text-sm">Respostas salvas no banco de dados, prontas para uso.</p>
        </div>
        <button onClick={fetchBriefings} className="flex items-center justify-center text-sm font-medium text-white/80 hover:text-white transition-colors bg-[#12141a] border border-white/10 px-5 py-2.5 rounded-lg shadow-sm hover:bg-white/5">
          <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Integração Google Sheets (Sidebar) */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-[#12141a] border border-white/10 p-6 rounded-2xl shadow-sm sticky top-24">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="text-green-500" size={20} />
              </div>
              <h2 className="text-base font-bold text-white">Google Sheets</h2>
            </div>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              Você pode usar o n8n para enviar esses dados para o Google Sheets, ou usar a integração nativa com o webhook via Google Apps Script.
            </p>
          </div>
        </div>

        {/* Respostas Listagem */}
        <div className="lg:col-span-3 space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-white/40">
              <RefreshCw size={24} className="animate-spin mx-auto mb-4" />
              Buscando informações...
            </div>
          ) : briefings.length === 0 ? (
            <div className="bg-[#12141a] border border-white/10 p-12 rounded-2xl text-center text-white/40 shadow-sm flex flex-col items-center">
              <Database size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-lg text-white/60 font-medium">Nenhum briefing recebido ainda.</p>
              <p className="text-sm mt-2">Assim que os clientes preencherem o formulário, as pastas aparecerão aqui.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {briefings.map((b) => (
                <BriefingCard key={b.id} b={b} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
