// app/noticias/NoticiasClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface Noticia {
  _id: string;
  titulo: string;
  resumo: string;
  dataPublicacao: string;
  imagemUrl?: string;
  slug: string;
}

export default function NoticiasClient({ noticiasSanity = [] }: { noticiasSanity: Noticia[] }) {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  
  // =========================================
  // ESTADOS DOS FILTROS E BUSCA
  // =========================================
  const [termoBusca, setTermoBusca] = useState('');
  const [ordem, setOrdem] = useState<'recente' | 'antiga'>('recente');
  const [dataFiltro, setDataFiltro] = useState('');

  // Lógica inteligente que filtra e ordena as notícias instantaneamente
  const noticiasProcessadas = useMemo(() => {
    let filtradas = [...noticiasSanity];

    // 1. Filtro de Texto (Lupa)
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      filtradas = filtradas.filter(noticia => 
        noticia.titulo.toLowerCase().includes(termo) || 
        noticia.resumo.toLowerCase().includes(termo)
      );
    }

    // 2. Filtro por Data Específica
    if (dataFiltro) {
      filtradas = filtradas.filter(noticia => {
        const dataNoticia = noticia.dataPublicacao.split('T')[0];
        return dataNoticia === dataFiltro;
      });
    }

    // 3. Ordenação (Mais recente / Mais antiga)
    filtradas.sort((a, b) => {
      const dataA = new Date(a.dataPublicacao).getTime();
      const dataB = new Date(b.dataPublicacao).getTime();
      return ordem === 'recente' ? dataB - dataA : dataA - dataB;
    });

    return filtradas;
  }, [noticiasSanity, termoBusca, ordem, dataFiltro]);

  return (
    // Adicionado 'flex flex-col' para travar o vazamento de fundo
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2] flex flex-col">
      
      {/* =========================================
          CONTAINER PRINCIPAL DAS NOTÍCIAS
          (Trocado 'mt-4 md:mt-12' por 'pt-8 md:pt-12' e adicionado 'w-full flex-1')
      ========================================= */}
      <div className="max-w-md md:max-w-6xl mx-auto pt-8 md:pt-12 px-6 w-full flex-1">

        {/* TÍTULO DA PÁGINA (Ajustado para aparecer no Mobile e Desktop) */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#401D10] tracking-tight mb-3 md:mb-4">
            Últimas Notícias
          </h1>
          <p className="text-sm md:text-lg text-[#735A51] max-w-2xl mx-auto px-2">
            Acompanhe os avisos, informativos e acontecimentos da Paróquia São José do Patrocínio e de nossas comunidades.
          </p>
        </div>

        {/* =========================================
            BARRA DE BUSCA E FILTROS AJUSTADA
        ========================================= */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#A6948D]/20 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Lupa e Campo de Busca */}
          <div className="relative w-full md:max-w-md">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A6948D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar por título..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F2F2F2] border-transparent focus:border-[#A6948D] focus:bg-white text-[#401D10] outline-none transition-all"
            />
          </div>

          {/* Filtros à direita */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            
            {/* Input de Data */}
            <div className="relative w-full sm:w-auto">
              <input 
                type="date" 
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#F2F2F2] text-[#401D10] border-transparent focus:border-[#A6948D] focus:bg-white outline-none cursor-pointer"
              />
            </div>

            {/* Select de Ordem */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as 'recente' | 'antiga')}
                className="w-full sm:w-auto px-4 py-3 pr-10 rounded-2xl bg-[#F2F2F2] text-[#401D10] border-transparent focus:border-[#A6948D] focus:bg-white outline-none cursor-pointer appearance-none whitespace-nowrap"
              >
                <option value="recente">Mais recentes</option>
                <option value="antiga">Mais antigas</option>
              </select>
              <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#A6948D] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* =========================================
            LISTAGEM DE NOTÍCIAS
        ========================================= */}
        {noticiasProcessadas.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#A6948D]">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#A6948D]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#735A51] font-medium text-lg">Nenhuma notícia encontrada com estes filtros.</p>
            <button 
              onClick={() => { setTermoBusca(''); setDataFiltro(''); setOrdem('recente'); }}
              className="mt-4 text-[#592C1C] font-bold hover:underline"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticiasProcessadas.map((noticia) => (
              <article 
                key={noticia._id} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-[#A6948D]/10 hover:-translate-y-1"
              >
                <div className="relative h-56 w-full bg-[#A6948D]/20 overflow-hidden">
                  {noticia.imagemUrl ? (
                    <img 
                      src={noticia.imagemUrl} 
                      alt={noticia.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A6948D]">
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <time className="text-sm font-bold text-[#A6948D] mb-3 uppercase tracking-wider">
                    {format(new Date(noticia.dataPublicacao), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </time>
                  
                  <h3 className="text-2xl font-serif font-bold text-[#401D10] leading-tight mb-4 group-hover:text-[#592C1C] transition-colors line-clamp-3">
                    {noticia.titulo}
                  </h3>
                  
                  <p className="text-[#735A51] mb-6 line-clamp-3 flex-grow">
                    {noticia.resumo}
                  </p>
                  
                  <a 
                    href={`/noticias/${noticia.slug}`} 
                    className="inline-flex items-center gap-2 text-[#592C1C] font-bold hover:text-[#401D10] transition-colors mt-auto"
                  >
                    Ler matéria completa
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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