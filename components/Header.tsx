// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  
  // =========================================
  // ESTADOS DO SMART HEADER
  // =========================================
  const [visivel, setVisivel] = useState(true);
  const [noTopo, setNoTopo] = useState(true);
  const [ultimoScroll, setUltimoScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Pega a posição atual da rolagem (evita números negativos em iPhones)
      const atual = Math.max(window.scrollY, 0);

      // Define se estamos no topo da página
      setNoTopo(atual < 20);

      // Lógica para esconder ao rolar para baixo e mostrar ao rolar para cima
      if (atual > ultimoScroll && atual > 100) {
        setVisivel(false); // Esconde
      } else {
        setVisivel(true);  // Mostra
      }

      setUltimoScroll(atual);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ultimoScroll]);

  return (
    <>
      {/* 
        A mágica acontece aqui: 'sticky top-0' prende ele no topo.
        'translate-y-0' mostra e '-translate-y-full' esconde puxando pra cima.
      */}
      <div 
        className={`sticky top-0 z-[100] w-full bg-[#F2F2F2] transition-all duration-300 ease-in-out ${
          visivel ? 'translate-y-0' : '-translate-y-full'
        } ${
          noTopo ? 'border-b border-[#A6948D]/30' : 'shadow-lg border-transparent'
        }`}
      >
        {/* =========================================
            HEADER DESKTOP
        ========================================= */}
        {/* O padding 'py' diminui quando não está no topo para o header ficar mais fino */}
        <header className={`hidden md:flex justify-between items-center px-12 transition-all duration-300 ${noTopo ? 'py-6' : 'py-3'}`}>
          
          {/* 👇 LADO ESQUERDO: Logo (Tau) + Botões */}
          <div className="flex-1 flex items-center gap-4">
            <a href="/" className="inline-block transition-transform hover:scale-105 shrink-0">
              {/* A logo também diminui sutilmente de h-12 para h-10 */}
              <img src="/Tau2.png" alt="Logo Paróquia São José do Patrocínio" className={`w-auto object-contain transition-all duration-300 ${noTopo ? 'h-12' : 'h-10'}`} />
            </a>

            <div className="flex items-center gap-3">
              {/* Botão Vocacional */}
              <a 
                href="https://franciscanos.org.br/vocacional/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2 bg-[#09402C] text-[#F2F2F2] rounded-full text-sm font-bold font-sans hover:bg-[#05261A] transition-colors shadow-sm whitespace-nowrap"
              >
                Vocacional
              </a>

              {/* 👇 NOVO: Botão Intenção do Papa (Estilo com borda) */}
              <a 
                href="https://redemundialdeoracaodopapa.pt/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2 border-2 border-[#BF946F] text-[#BF946F] rounded-full text-sm font-bold font-sans hover:bg-[#BF946F] hover:text-[#F2F2F2] transition-colors shadow-sm whitespace-nowrap"
              >
                Intenção do Papa
              </a>
            </div>
          </div>
          
          {/* NAVEGAÇÃO CENTRAL */}
          <nav className="flex-none flex gap-8 font-serif text-lg items-center">
            <a href="/" className="text-[#735A51] hover:text-[#401D10] transition-colors">Início</a>
            <a href="/noticias" className="text-[#735A51] hover:text-[#401D10] transition-colors">Notícias</a>
            <a href="/calendario" className="text-[#735A51] hover:text-[#401D10] transition-colors">Calendário</a>

            <div className="relative group">
              <button className="text-[#735A51] hover:text-[#401D10] transition-colors flex items-center gap-1 pb-1">
                Vida Cristã
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white shadow-xl rounded-xl border border-[#A6948D]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2">
                <a href="/liturgia" className="px-4 py-2 text-base font-sans text-[#735A51] hover:bg-[#A6948D]/10 hover:text-[#401D10] transition-colors">Liturgia Diária</a>
                <a href="/velas" className="px-4 py-2 text-base font-sans text-[#735A51] hover:bg-[#A6948D]/10 hover:text-[#401D10] transition-colors">Vela Virtual</a>
                <a href="/pastorais" className="px-4 py-2 text-base font-sans text-[#735A51] hover:bg-[#A6948D]/10 hover:text-[#401D10] transition-colors">Pastorais e Movimentos</a>
              </div>
            </div>

            <div className="relative group">
              <button className="text-[#735A51] hover:text-[#401D10] transition-colors flex items-center gap-1 pb-1">
                Institucional
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white shadow-xl rounded-xl border border-[#A6948D]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2">
                <a href="/sobre" className="px-4 py-2 text-base font-sans text-[#735A51] hover:bg-[#A6948D]/10 hover:text-[#401D10] transition-colors">Sobre a Paróquia</a>
                <a href="/comunidades" className="px-4 py-2 text-base font-sans text-[#735A51] hover:bg-[#A6948D]/10 hover:text-[#401D10] transition-colors">Comunidades</a>
              </div>
            </div>
          </nav>

          {/* 👇 LADO DIREITO: Apenas Acesso Secretaria */}
          <div className="flex-1 flex justify-end">
            <a href="https://www.sanity.io/manage/project/6r6351cq" className="text-sm font-sans font-medium text-[#A6948D] hover:text-[#735A51] transition-colors">Acesso Secretaria</a>
          </div>
        </header>

{/* =========================================
            HEADER MOBILE
        ========================================= */}
        <div className={`md:hidden flex justify-between items-center px-6 transition-all duration-300 ${noTopo ? 'py-6' : 'py-3'}`}>
          <a href="/" className="flex items-center">
            <img 
              src="/Tau2.png" 
              alt="Logo Paróquia" 
              className="h-10 w-auto object-contain transform scale-100 origin-left" 
            />
          </a>
          
          <button onClick={() => setMenuAberto(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#401D10] text-[#F2F2F2] shadow-md active:scale-95 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </div>
      </div>

      {/* =========================================
          OVERLAY DO MENU MOBILE (Abre por cima de tudo)
      ========================================= */}
      {menuAberto && (
        <div className="md:hidden fixed inset-0 z-[200] flex justify-end bg-[#401D10]/20 backdrop-blur-sm transition-opacity">
          <div className="absolute inset-0" onClick={() => setMenuAberto(false)} />
          
          <div className="relative w-72 bg-[#F2F2F2] h-full p-8 shadow-2xl flex flex-col justify-between text-[#401D10] z-10 overflow-y-auto">
            <div>
              <div className="flex justify-end mb-8">
                <button onClick={() => setMenuAberto(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#A6948D]/20 text-[#735A51] active:scale-95 transition-transform hover:bg-[#A6948D]/40">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-6 font-serif w-full">
                
                {/* 👇 ADICIONADO: Dois botões em formato de coluna no Mobile */}
                <div className="flex flex-col gap-3 mb-8">
                  {/* Botão Sólido Vocacional */}
                  <a 
                    href="https://franciscanos.org.br/vocacional/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-center px-6 py-3 bg-[#09402C] text-[#F2F2F2] rounded-2xl text-lg font-bold font-sans hover:bg-[#05261A] transition-colors shadow-md"
                  >
                    Vocacional
                  </a>

                  {/* Botão Intenção do Papa */}
                  <a 
                    href="https://redemundialdeoracaodopapa.pt/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-center px-6 py-3 border-2 border-[#BF946F] text-[#BF946F] rounded-2xl text-lg font-bold font-sans hover:bg-[#BF946F] hover:text-[#F2F2F2] transition-colors shadow-sm"
                  >
                    Intenção do Papa
                  </a>
                </div>

                <a href="/" className="block text-2xl text-[#735A51] hover:text-[#401D10] transition-colors">Início</a>
                <a href="/noticias" className="block text-2xl text-[#735A51] hover:text-[#401D10] transition-colors">Notícias</a>
                <a href="/calendario" className="block text-2xl text-[#735A51] hover:text-[#401D10] transition-colors">Calendário</a>
                
                <details className="group [&::-webkit-details-marker]:hidden">
                  <summary className="text-2xl text-[#735A51] hover:text-[#401D10] transition-colors cursor-pointer list-none flex justify-between items-center">
                    Vida Cristã
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-[#A6948D]/50 font-sans">
                    <a href="/liturgia" className="text-lg text-[#735A51] hover:text-[#401D10]">Liturgia Diária</a>
                    <a href="/velas" className="text-lg text-[#735A51] hover:text-[#401D10]">Vela Virtual</a>
                    <a href="/pastorais" className="text-lg text-[#735A51] hover:text-[#401D10]">Pastorais e Movimentos</a>
                  </div>
                </details>

                <details className="group [&::-webkit-details-marker]:hidden">
                  <summary className="text-2xl text-[#735A51] hover:text-[#401D10] transition-colors cursor-pointer list-none flex justify-between items-center">
                    Institucional
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-[#A6948D]/50 font-sans">
                    <a href="/sobre" className="text-lg text-[#735A51] hover:text-[#401D10]">Sobre a Paróquia</a>
                    <a href="/comunidades" className="text-lg text-[#735A51] hover:text-[#401D10]">Comunidades</a>
                  </div>
                </details>
              </nav>
            </div>

            <div className="mt-8">
              <div className="flex flex-col items-center mb-6">
                <img 
                  src="/Tau4.svg" 
                  alt="Logo da Paróquia" 
                  className="w-28 h-28 object-contain transform scale-[1.5] origin-center mb-2" 
                />
                <span className="font-serif font-bold text-[#401D10] leading-tight text-lg text-center relative z-10">
                  Paróquia<br />São José do Patrocínio
                </span>
              </div>

              <div className="pt-6 border-t border-[#A6948D]/30">
                <a href="https://www.sanity.io/manage/project/6r6351cq" className="text-sm font-sans text-[#A6948D] hover:text-[#735A51] transition-colors flex items-center gap-2">
                  🔒 Acesso Secretaria
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </> 
  );
}