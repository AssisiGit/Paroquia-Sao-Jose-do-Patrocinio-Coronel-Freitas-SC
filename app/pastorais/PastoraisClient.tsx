'use client';

import { useState, useEffect } from 'react';

interface Pastoral {
  _id: string;
  nome: string;
  coordenador?: string;
  contato?: string;
  encontros?: string;
  descricao?: string;
  imagemUrl?: string;
}

export default function PastoraisClient({ pastorais }: { pastorais: Pastoral[] }) {
  const [pastoralSelecionada, setPastoralSelecionada] = useState<Pastoral | null>(null);

  useEffect(() => {
    const menuHeader = document.querySelector('header') || document.querySelector('nav') as HTMLElement;

    if (pastoralSelecionada) {
      document.body.style.overflow = 'hidden';
      if (menuHeader) menuHeader.style.visibility = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      if (menuHeader) menuHeader.style.visibility = 'visible';
    }

    return () => {
      document.body.style.overflow = 'auto';
      if (menuHeader) menuHeader.style.visibility = 'visible';
    };
  }, [pastoralSelecionada]);

  return (
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2]">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="max-w-6xl mx-auto pt-16 md:pt-24 px-6 text-center mb-16">
        <span className="flex items-center justify-center gap-2 text-[#A6948D] font-bold tracking-widest uppercase text-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-[#592C1C]"></span>
          Força Viva da Paróquia
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#401D10] mb-6">Pastorais e Movimentos</h1>
        <p className="text-[#735A51] text-lg max-w-2xl mx-auto">
          Conheça os grupos que animam, servem e evangelizam em nossa comunidade.
        </p>
      </div>

      {/* GRID DE QUADRADOS */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {pastorais.map((pastoral) => (
            <div 
              key={pastoral._id} 
              onClick={() => setPastoralSelecionada(pastoral)}
              className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-[#A6948D]/10"
            >
              {pastoral.imagemUrl ? (
                <img 
                  src={pastoral.imagemUrl} 
                  alt={pastoral.nome} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#A6948D]/20 text-[#735A51]">
                  Sem foto
                </div>
              )}

              {/* 👇 MUDANÇA 1: Degradê mais alto, escuro e cobrindo mais área para garantir legibilidade total */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#401D10] via-[#401D10]/70 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* 👇 MUDANÇA 2: Ajuste de padding (px-8 pb-5) para deixar o texto um pouco mais abaixo */}
              <div className="absolute bottom-0 left-0 right-0 px-8 pt-8 pb-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h2 className="text-white font-serif font-bold text-3xl leading-tight">
                  {pastoral.nome}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span className="text-sm font-bold uppercase tracking-wider">Ver detalhes</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL POP-UP */}
      {pastoralSelecionada && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#401D10]/80 backdrop-blur-md" 
          onClick={() => setPastoralSelecionada(null)}
        >
          <div 
            className="bg-[#F2F2F2] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setPastoralSelecionada(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#735A51] hover:bg-[#A6948D]/20 transition-colors z-20 shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex flex-col md:flex-row">
              
              {pastoralSelecionada.imagemUrl && (
                <div className="w-full md:w-2/5 h-64 md:h-auto">
                  <img 
                    src={pastoralSelecionada.imagemUrl} 
                    alt={pastoralSelecionada.nome} 
                    className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" 
                  />
                </div>
              )}

              <div className="p-8 md:p-12 flex-1 w-full flex flex-col justify-center">
                <span className="inline-block bg-[#A6948D]/20 text-[#592C1C] font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 w-max">
                  Pastoral / Movimento
                </span>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#401D10] mb-8 leading-tight">
                  {pastoralSelecionada.nome}
                </h2>

                <div className="flex flex-col gap-5 mb-8 bg-white p-6 rounded-2xl border border-[#A6948D]/10 shadow-sm">
                  
                  {pastoralSelecionada.encontros && (
                    <div className="flex items-start gap-3 border-b border-[#A6948D]/10 pb-4">
                      <div className="bg-[#A6948D]/10 p-2 rounded-lg text-[#592C1C] shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#A6948D] uppercase tracking-wider mb-0.5">Encontros e Local</span>
                        <span className="text-[#401D10] font-medium text-base md:text-lg">{pastoralSelecionada.encontros}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastoralSelecionada.coordenador && (
                      <div>
                        <span className="block text-xs font-bold text-[#A6948D] uppercase tracking-wider mb-1">Coordenador(a)</span>
                        <span className="text-[#401D10] font-medium text-base md:text-lg">{pastoralSelecionada.coordenador}</span>
                      </div>
                    )}
                    {pastoralSelecionada.contato && (
                      <div>
                        <span className="block text-xs font-bold text-[#A6948D] uppercase tracking-wider mb-1">Contato</span>
                        <span className="text-[#401D10] font-medium text-base md:text-lg">{pastoralSelecionada.contato}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <span className="block text-xs font-bold text-[#A6948D] uppercase tracking-wider mb-3">Sobre nós</span>
                  <div className="text-[#735A51] text-lg leading-relaxed whitespace-pre-wrap">
                    {pastoralSelecionada.descricao ? pastoralSelecionada.descricao : 'Informações não cadastradas.'}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}