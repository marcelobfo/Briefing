/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import BriefingForm from './components/BriefingForm';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-[#050608] font-sans text-[#e0e0e0] selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="bg-[#0a0c10]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="text-white font-bold text-xl leading-none">T</span>
            </div>
            <span className="font-bold text-sm tracking-widest uppercase text-white">Techne Digital</span>
          </div>
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isAdmin ? 'Voltar ao Formulário' : 'Acesso Admin'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 relative z-10">
        {isAdmin ? <AdminPanel /> : (
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-light tracking-tight text-white mb-4">Briefing de Lançamento</h1>
              <p className="text-sm text-white/40 max-w-2xl mx-auto">
                Preencha este documento com o máximo de detalhes possível. As respostas orientam toda a estratégia, o design e a construção do projeto.
              </p>
            </div>
            <BriefingForm />
          </div>
        )}
      </main>
    </div>
  );
}
