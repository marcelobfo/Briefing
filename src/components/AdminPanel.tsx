import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, Database, FileSpreadsheet, Lock } from 'lucide-react';

export default function AdminPanel() {
  const [briefings, setBriefings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const fetchBriefings = async () => {
    setIsLoading(true);
    try {
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
    // Using a simple hardcoded password for demonstration.
    // In production, this should be validated server-side.
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#0a0c10] border border-white/10 rounded-2xl shadow-sm border border-white/5">
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
              className="w-full px-4 py-3 rounded-lg border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
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
    <div className="max-w-6xl mx-auto px-4">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Briefings Recebidos</h1>
          <p className="text-white/40 mt-2">Os dados estão sendo salvos no banco de dados MySQL configurado.</p>
        </div>
        <button onClick={fetchBriefings} className="flex items-center text-sm font-medium text-white/60 hover:text-blue-600 transition-colors bg-[#0a0c10] border border-white/10 px-4 py-2 border border-white/5 rounded-lg shadow-sm">
          <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Integração Google Sheets */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a0c10] border border-white/10 p-6 rounded-2xl shadow-sm border border-white/5 sticky top-24">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="text-green-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Salvar no Google Sheets</h2>
            </div>
            
            <p className="text-sm text-white/60 mb-4">
              Para salvar as respostas <b>diretamente em uma planilha do Google</b>, crie um Webhook usando o Google Apps Script e adicione na variável de ambiente <code className="bg-white/5 text-white px-1 py-0.5 rounded">GOOGLE_SHEETS_WEBHOOK_URL</code> no arquivo <code className="bg-white/5 text-white px-1 py-0.5 rounded">.env</code> ou nas Configurações.
            </p>

            <div className="space-y-4 text-sm text-white/80">
              <div>
                <span className="font-semibold block mb-1">1. Crie uma nova planilha do Google</span>
                Adicione cabeçalhos na primeira linha com os exatos nomes dos campos (companyName, contactName, etc.).
              </div>
              <div>
                <span className="font-semibold block mb-1">2. Vá em Extensões {'>'} Apps Script</span>
                Cole o seguinte código:
              </div>
              <pre className="text-xs bg-indigo-600 text-gray-100 p-3 rounded-lg overflow-x-auto">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = [];
  
  for (var i = 0; i < headers.length; i++) {
    row.push(data[headers[i]] || "");
  }
  
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({"success": true})).setMimeType(ContentService.MimeType.JSON);
}`}
              </pre>
              <div>
                <span className="font-semibold block mb-1">3. Implante como Web app</span>
                Selecione "Qualquer pessoa" para ter acesso e copie a URL gerada.
              </div>
            </div>
          </div>
        </div>

        {/* Respostas */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-white/40">
              <RefreshCw size={24} className="animate-spin mx-auto mb-4" />
              Carregando briefings...
            </div>
          ) : briefings.length === 0 ? (
            <div className="bg-[#0a0c10] border border-white/10 p-10 rounded-2xl border border-white/5 text-center text-white/40 shadow-sm">
              <Database size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhum briefing recebido ainda.</p>
            </div>
          ) : (
            briefings.map((b) => (
              <div key={b.id} className="bg-[#0a0c10] border border-white/10 p-6 rounded-2xl border border-white/5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{b.company_name}</h3>
                    <p className="text-sm text-white/40">{new Date(b.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    ID: {b.id}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="block text-white/40 font-medium">Contato</span>
                    <span className="text-white">{b.contact_name}</span>
                  </div>
                  <div>
                    <span className="block text-white/40 font-medium">E-mail</span>
                    <span className="text-white">{b.contact_email}</span>
                  </div>
                  <div>
                    <span className="block text-white/40 font-medium">Telefone</span>
                    <span className="text-white">{b.contact_phone}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Dados Completos (JSON)</h4>
                  <pre className="bg-black/50 p-4 rounded-lg text-xs text-white/80 overflow-x-auto max-h-64 overflow-y-auto">
                    {JSON.stringify(b.responses_json, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
