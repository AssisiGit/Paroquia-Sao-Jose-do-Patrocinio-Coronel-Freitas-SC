// app/comunidades/ComunidadesClient.tsx
'use client';

import { useState, useMemo } from 'react';

interface Comunidade {
  _id: string;
  nome: string;
  slug: string;
  padroeiro?: string;
  imagemUrl?: string;
  endereco?: string;
  horariosMissa?: string;
}

export default function ComunidadesClient({ comunidadesSanity = [] }: { comunidadesSanity: Comunidade[] }) {
  const [termoBusca, setTermoBusca] = useState('');

  // Filtra as comunidades pelo nome, padroeiro ou endereço (bairro)
  const comunidadesFiltradas = useMemo(() => {
    if (!termoBusca) return comunidadesSanity;
    
    const termo = termoBusca.toLowerCase();
    return comunidadesSanity.filter(comunidade => 
      comunidade.nome?.toLowerCase().includes(termo) || 
      comunidade.padroeiro?.toLowerCase().includes(termo) ||
      comunidade.endereco?.toLowerCase().includes(termo)
    );
  }, [comunidadesSanity, termoBusca]);

  return (
    // Adicionado 'flex flex-col' para evitar vazamento de fundo
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2] flex flex-col">
      
      {/* =========================================
          CONTAINER PRINCIPAL DAS COMUNIDADES
          (Trocado 'mt' por 'pt' e adicionado 'w-full flex-1')
      ========================================= */}
      <div className="max-w-md md:max-w-6xl mx-auto pt-8 md:pt-12 px-6 w-full flex-1">

        {/* TOPO DA PÁGINA (Ajustado para Mobile e Desktop) */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#401D10] tracking-tight mb-3 md:mb-4">
            Nossas Comunidades
          </h1>
          <p className="text-sm md:text-lg text-[#735A51] max-w-2xl mx-auto px-2">
            A Paróquia São José do Patrocínio é formada por uma rede viva de fé. Encontre a comunidade mais próxima de você.
          </p>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#A6948D]/20 mb-10">
          <div className="relative w-full">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A6948D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar pelo nome da comunidade, padroeiro ou bairro..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F2F2F2] border-transparent focus:border-[#A6948D] focus:bg-white focus:ring-0 text-[#401D10] placeholder-[#A6948D] outline-none transition-all"
            />
          </div>
        </div>

        {/* LISTAGEM EM CARDS */}
        {comunidadesFiltradas.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#A6948D]">
            <p className="text-[#735A51] font-medium text-lg">Nenhuma comunidade encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comunidadesFiltradas.map((com) => (
              <article key={com._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#A6948D]/10 flex flex-col group hover:-translate-y-1">
                
                {/* Imagem (Fica no topo do card) */}
                <div className="relative h-48 w-full bg-[#A6948D]/20 overflow-hidden">
                  {com.imagemUrl ? (
                    <img src={com.imagemUrl} alt={com.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A6948D]">
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </div>
                  )}
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-[#401D10] leading-tight mb-1">{com.nome}</h3>
                  {com.padroeiro && <p className="text-[#A6948D] font-medium text-sm uppercase tracking-wider mb-4">Padroeiro(a): {com.padroeiro}</p>}
                  
                  <div className="space-y-3 mb-6 flex-grow">
                    {/* Linha de Endereço */}
                    {com.endereco && (
                      <div className="flex items-start gap-2 text-[#735A51]">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#592C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-sm leading-relaxed">{com.endereco}</span>
                      </div>
                    )}
                    
                    {/* Linha de Horários */}
                    {com.horariosMissa && (
                      <div className="flex items-start gap-2 text-[#735A51]">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#592C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-sm leading-relaxed whitespace-pre-wrap">{com.horariosMissa}</span>
                      </div>
                    )}
                  </div>

                  <a href={`/comunidades/${com.slug}`} className="w-full block text-center bg-[#F2F2F2] hover:bg-[#401D10] text-[#401D10] hover:text-white font-bold py-3 rounded-xl transition-colors border border-[#A6948D]/20">
                    Detalhes da Comunidade
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}