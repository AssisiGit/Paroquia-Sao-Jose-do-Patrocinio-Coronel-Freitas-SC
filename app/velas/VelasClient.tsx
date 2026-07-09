// app/velas/VelasClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Vela {
  _id: string;
  nome: string;
  intencao: string;
  _createdAt: string;
}

export default function VelasClient({ velasIniciais }: { velasIniciais: Vela[] }) {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [nome, setNome] = useState('');
  const [intencao, setIntencao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

const acenderVela = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    
    try {
      // Envia os dados para a nossa própria rota de segurança
      const response = await fetch('/api/velas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, intencao }),
      });

      if (response.ok) {
        setEnviando(false);
        setSucesso(true);
        setNome('');
        setIntencao('');
        
        // Atualiza a página para puxar a nova vela que acabou de ser criada
        router.refresh(); 

        setTimeout(() => setSucesso(false), 5000);
      } else {
        alert("Ocorreu um erro ao acender a vela. Tente novamente.");
        setEnviando(false);
      }
    } catch (error) {
      console.error(error);
      alert("Falha de conexão. Verifique sua internet.");
      setEnviando(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2] flex flex-col">
      
      {/* CONTAINER DO CONTEÚDO */}
      <div className="max-w-md lg:max-w-6xl mx-auto px-6 w-full flex-1">
        
        {/* =========================================
            TÍTULO UNIFICADO E CENTRALIZADO (MOBI/DESK)
        ========================================= */}
        <div className="text-center mb-12 md:mb-16 mt-2 md:mt-0">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#401D10] leading-tight mb-4">
            Vela Virtual
          </h1>
          <p className="text-sm md:text-xl text-[#735A51] max-w-2xl mx-auto leading-relaxed px-2">
            Acenda uma vela e deixe sua intenção de oração. Nossa comunidade estará unida em prece por você.
          </p>
        </div>

        {/* ESTRUTURA DOS CARDS */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* FORMULÁRIO DE ACENDER A VELA */}
          <div className="w-full lg:w-[22rem] bg-white p-8 rounded-[2rem] shadow-sm border border-[#A6948D]/20 shrink-0 lg:sticky lg:top-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-[#592C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
              <h2 className="text-2xl font-serif font-bold text-[#401D10]">Acender Vela</h2>
            </div>

            {sucesso ? (
              <div className="bg-[#68D391]/10 border border-[#68D391]/30 p-6 rounded-2xl text-center my-4">
                <span className="text-3xl mb-2 block animate-bounce">🕯️</span>
                <h3 className="font-bold text-[#276749] text-lg mb-1">Vela Acesa!</h3>
                <p className="text-sm text-[#2F855A]">Sua intenção foi registrada com sucesso.</p>
              </div>
            ) : (
              <form onSubmit={acenderVela} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#735A51] mb-2 uppercase tracking-wider">Seu Nome</label>
                  <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#F2F2F2] border border-[#A6948D]/30 rounded-xl px-4 py-3 text-[#401D10] focus:outline-none focus:ring-2 focus:ring-[#592C1C] transition-all text-sm" placeholder="Ex: Maria Silva" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#735A51] mb-2 uppercase tracking-wider">Sua Intenção</label>
                  <textarea required rows={4} value={intencao} onChange={(e) => setIntencao(e.target.value)} className="w-full bg-[#F2F2F2] border border-[#A6948D]/30 rounded-xl px-4 py-3 text-[#401D10] focus:outline-none focus:ring-2 focus:ring-[#592C1C] transition-all resize-none text-sm leading-relaxed" placeholder="Peço orações por..."></textarea>
                </div>
                <button type="submit" disabled={enviando} className={`w-full py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${enviando ? 'bg-[#A6948D] text-white cursor-not-allowed' : 'bg-[#592C1C] text-white hover:bg-[#401D10] shadow-md hover:shadow-lg active:scale-95'}`}>
                  {enviando ? 'Acendendo...' : 'Acender Vela'}
                </button>
              </form>
            )}
          </div>

          {/* CAPELA VIRTUAL */}
          <div className="flex-1 w-full">
            <h3 className="text-lg font-bold text-[#A6948D] mb-6 uppercase tracking-widest border-b border-[#A6948D]/20 pb-4">Intenções da Comunidade</h3>
            
            {velasIniciais.length === 0 ? (
              <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-[#A6948D]">
                <p className="text-[#735A51] font-medium">Seja o primeiro a acender uma vela hoje.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {velasIniciais.map((vela) => (
                  <div key={vela._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#A6948D]/20 flex gap-5 items-start transition-all hover:shadow-md">
                    
                    {/* Chama Animada CSS */}
                    <div className="shrink-0 flex flex-col items-center mt-1">
                      <div className="w-3 h-5 bg-[#F6E05E] rounded-full blur-[0.5px] animate-pulse shadow-[0_0_12px_#F6E05E,0_0_24px_#ED8936]"></div>
                      <div className="w-1 h-2 bg-gray-800 rounded-sm -mt-1 z-10"></div>
                      <div className="w-6 h-12 bg-gradient-to-b from-[#FFF5F5] to-[#E2E8F0] rounded-sm border border-gray-200 shadow-inner"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#401D10] text-lg mb-0.5 leading-tight truncate">{vela.nome}</h4>
                      <span className="text-xs font-bold text-[#A6948D] uppercase tracking-wider block mb-3">
                        {new Date(vela._createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <p className="text-[#735A51] text-sm leading-relaxed italic border-l-2 border-[#A6948D]/30 pl-3 whitespace-pre-wrap">
                        "{vela.intencao}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}