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
  // =========================================
  // ESTADOS DOS FILTROS E BUSCA
  // =========================================
  const [termoBusca, setTermoBusca] = useState('');
  const [ordem, setOrdem] = useState<'recente' | 'antiga'>('recente');
  const [dataFiltro, setDataFiltro] = useState('');
  const [ordemAberto, setOrdemAberto] = useState(false);

  // =========================================
  // ESTADOS DO CALENDÁRIO CUSTOMIZADO
  // =========================================
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [mesVisualizado, setMesVisualizado] = useState(new Date());

  // Lógica para desenhar os dias no calendário customizado
  const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  
  const getDiasDoMes = () => {
    const ano = mesVisualizado.getFullYear();
    const mes = mesVisualizado.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay(); // Descobre em qual dia da semana cai o dia 1
    const totalDias = new Date(ano, mes + 1, 0).getDate(); // Descobre o último dia do mês
    
    const dias = [];
    for (let i = 0; i < primeiroDia; i++) dias.push(null); // Espaços vazios antes do dia 1
    for (let i = 1; i <= totalDias; i++) dias.push(i); // Os dias do mês
    return dias;
  };

  const selecionarData = (dia: number) => {
    const ano = mesVisualizado.getFullYear();
    const mes = String(mesVisualizado.getMonth() + 1).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    setDataFiltro(`${ano}-${mes}-${diaStr}`); // Formato YYYY-MM-DD
    setCalendarioAberto(false);
  };

  const mesAnterior = () => setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() - 1, 1));
  const proximoMes = () => setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() + 1, 1));


  // =========================================
  // LÓGICA DE FILTRAGEM DE NOTÍCIAS
  // =========================================
  const noticiasProcessadas = useMemo(() => {
    let filtradas = [...noticiasSanity];

    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      filtradas = filtradas.filter(noticia => 
        noticia.titulo.toLowerCase().includes(termo) || 
        noticia.resumo.toLowerCase().includes(termo)
      );
    }

    if (dataFiltro) {
      filtradas = filtradas.filter(noticia => {
        const dataNoticia = noticia.dataPublicacao.split('T')[0];
        return dataNoticia === dataFiltro;
      });
    }

    filtradas.sort((a, b) => {
      const dataA = new Date(a.dataPublicacao).getTime();
      const dataB = new Date(b.dataPublicacao).getTime();
      return ordem === 'recente' ? dataB - dataA : dataA - dataB;
    });

    return filtradas;
  }, [noticiasSanity, termoBusca, ordem, dataFiltro]);

  return (
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2] flex flex-col">
      
      <div className="max-w-md md:max-w-6xl mx-auto pt-8 md:pt-12 px-6 w-full flex-1">

        {/* TÍTULO DA PÁGINA */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#401D10] tracking-tight mb-3 md:mb-4">
            Últimas Notícias
          </h1>
          <p className="text-sm md:text-lg text-[#735A51] max-w-2xl mx-auto px-2">
            Acompanhe os avisos, informativos e acontecimentos da Paróquia São José do Patrocínio e de nossas comunidades.
          </p>
        </div>

        {/* =========================================
            BARRA DE BUSCA E FILTROS MODERNIZADOS
        ========================================= */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#A6948D]/20 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between relative z-20">
          
          {/* Lupa e Campo de Busca */}
          <div className="relative w-full lg:max-w-md">
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
          <div className="flex flex-row gap-4 w-full lg:w-auto items-center justify-between lg:justify-end">
            
            {/* ÍCONE DE CALENDÁRIO COM ETIQUETA */}
            <div className="flex items-center gap-3">
              {dataFiltro && (
                <div className="flex items-center gap-2 bg-[#592C1C] text-white pl-3 pr-2 py-1.5 rounded-xl text-sm font-medium shadow-sm">
                  <span>{dataFiltro.split('-').reverse().join('/')}</span>
                  <button onClick={() => setDataFiltro('')} className="p-1 hover:bg-white/20 rounded-md transition-colors" title="Limpar data">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              {/* Botão que abre o nosso Modal Customizado */}
              <button 
                onClick={() => setCalendarioAberto(true)}
                className="relative w-12 h-12 flex items-center justify-center bg-[#F2F2F2] hover:bg-[#A6948D]/20 rounded-xl transition-colors cursor-pointer group shadow-sm" 
                title="Filtrar por data"
              >
                <svg className="w-5 h-5 text-[#401D10] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* SELECT CUSTOMIZADO (Dropdown de Mais recentes) */}
            <div className="relative shrink-0">
              <button 
                onClick={() => setOrdemAberto(!ordemAberto)}
                className="flex items-center justify-between gap-3 px-5 py-3 w-[170px] rounded-xl bg-[#F2F2F2] hover:bg-[#A6948D]/15 text-[#401D10] font-medium transition-colors shadow-sm"
              >
                <span>{ordem === 'recente' ? 'Mais recentes' : 'Mais antigas'}</span>
                <svg className={`w-4 h-4 text-[#A6948D] transition-transform duration-200 ${ordemAberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {ordemAberto && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOrdemAberto(false)}></div>
                  <div className="absolute right-0 mt-2 w-[170px] bg-white rounded-xl shadow-xl border border-[#A6948D]/20 z-50 overflow-hidden flex flex-col py-2 transform origin-top transition-all">
                    <button onClick={() => { setOrdem('recente'); setOrdemAberto(false); }} className={`px-4 py-2.5 text-left transition-colors flex items-center justify-between ${ordem === 'recente' ? 'bg-[#F2F2F2] text-[#401D10] font-bold' : 'text-[#735A51] hover:bg-[#F2F2F2]/50 hover:text-[#401D10]'}`}>
                      Mais recentes
                      {ordem === 'recente' && <svg className="w-4 h-4 text-[#592C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <button onClick={() => { setOrdem('antiga'); setOrdemAberto(false); }} className={`px-4 py-2.5 text-left transition-colors flex items-center justify-between ${ordem === 'antiga' ? 'bg-[#F2F2F2] text-[#401D10] font-bold' : 'text-[#735A51] hover:bg-[#F2F2F2]/50 hover:text-[#401D10]'}`}>
                      Mais antigas
                      {ordem === 'antiga' && <svg className="w-4 h-4 text-[#592C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* =========================================
            MODAL DO CALENDÁRIO CUSTOMIZADO
        ========================================= */}
        {calendarioAberto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Fundo escuro */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCalendarioAberto(false)}></div>
            
            {/* Caixa do Calendário */}
            <div className="relative bg-white w-full max-w-[340px] rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              
              {/* Header: Mês e Setas */}
              <div className="bg-[#FAFAFA] flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#A6948D]/10">
                <button onClick={mesAnterior} className="text-[#401D10] hover:text-[#592C1C] transition-colors p-2 -ml-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="font-bold text-[#401D10] text-lg capitalize font-serif tracking-wide">
                  {format(mesVisualizado, "MMMM 'De' yyyy", { locale: ptBR })}
                </h3>
                <button onClick={proximoMes} className="text-[#401D10] hover:text-[#592C1C] transition-colors p-2 -mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Grid de Dias */}
              <div className="p-6">
                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 mb-4">
                  {diasDaSemana.map((dia, idx) => (
                    <div key={idx} className="text-center text-[10px] font-bold text-[#735A51] tracking-wider">
                      {dia}
                    </div>
                  ))}
                </div>

                {/* Números */}
                <div className="grid grid-cols-7 gap-y-4 text-center">
                  {getDiasDoMes().map((dia, index) => {
                    if (!dia) return <div key={index}></div>;
                    
                    const isDomingo = index % 7 === 0;
                    
                    return (
                      <div key={index} className="flex justify-center">
                        <button 
                          onClick={() => selecionarData(dia)}
                          className={`w-8 h-8 flex items-center justify-center font-bold rounded-full hover:bg-[#F2F2F2] transition-colors
                            ${isDomingo ? 'text-[#E53E3E]' : 'text-[#401D10]'}
                          `}
                        >
                          {dia}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer: Cancelar */}
              <div className="bg-[#FAFAFA] border-t border-[#A6948D]/10 px-6 py-4 flex justify-end">
                <button 
                  onClick={() => setCalendarioAberto(false)}
                  className="font-bold text-[#A6948D] hover:text-[#401D10] transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        )}

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