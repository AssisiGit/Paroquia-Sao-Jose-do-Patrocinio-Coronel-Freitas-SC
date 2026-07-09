// app/liturgia/LiturgiaClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Leitura {
  referencia: string;
  titulo: string;
  texto: string;
}

interface LiturgiaData {
  data: string;
  liturgia: string;
  cor: string;
  primeiraLeitura: Leitura;
  segundaLeitura?: Leitura | string;
  salmo: Leitura;
  evangelho: Leitura;
}

interface ReflexaoData {
  autor?: string;
  texto?: string;
}

export default function LiturgiaClient({ 
  liturgia, 
  reflexao,
  dataSelecionada 
}: { 
  liturgia: LiturgiaData | null;
  reflexao: ReflexaoData | null;
  dataSelecionada: string;
}) {
  const [montado, setMontado] = useState<boolean>(false); 
  
  // Estados do Modal de Calendário (Mantido)
  const [modalCalendarioAberto, setModalCalendarioAberto] = useState<boolean>(false);
  const [mesVisualizado, setMesVisualizado] = useState<Date>(new Date());
  
  const router = useRouter(); 

  useEffect(() => {
    setMontado(true);
  }, []);

  const dataReferencia = dataSelecionada ? new Date(dataSelecionada + 'T00:00:00') : new Date();
  dataReferencia.setHours(0, 0, 0, 0);

  const hojeReal = new Date();
  hojeReal.setHours(0, 0, 0, 0);

  const abrirCalendario = () => {
    setMesVisualizado(new Date(dataReferencia));
    setModalCalendarioAberto(true);
  };

  const mesAnterior = () => {
    setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() - 1, 1));
  };

  const proximoMes = () => {
    setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() + 1, 1));
  };

  const navegarParaData = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    router.push(`/liturgia?data=${ano}-${mes}-${dia}`);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const indice = [];
  if (liturgia) {
    indice.push({ id: 'primeira-leitura', label: '1ª Leitura' });
    indice.push({ id: 'salmo', label: 'Salmo' });
    if (liturgia.segundaLeitura && typeof liturgia.segundaLeitura !== 'string') {
      indice.push({ id: 'segunda-leitura', label: '2ª Leitura' });
    }
    indice.push({ id: 'evangelho', label: 'Evangelho' });
  }
  if (reflexao && reflexao.texto) {
    indice.push({ id: 'reflexao', label: 'Reflexão' });
  }

  const diasCalendario = Array.from({ length: 9 }).map((_, i) => {
    const data = new Date(dataReferencia);
    data.setDate(dataReferencia.getDate() + (i - 2)); 
    return data;
  });

  const getCorLiturgicaHex = (corStr: string) => {
    if (!corStr) return 'bg-[#A6948D]';
    const c = corStr.toLowerCase();
    if (c.includes('verde')) return 'bg-[#68D391]'; 
    if (c.includes('vermelho')) return 'bg-[#FC8181]'; 
    if (c.includes('roxo')) return 'bg-[#B794F4]'; 
    if (c.includes('rosáceo') || c.includes('rosa')) return 'bg-[#FBB6CE]';
    if (c.includes('branco') || c.includes('ouro')) return 'bg-[#F6E05E]'; 
    return 'bg-[#A6948D]';
  };

  const getNomeDia = (data: Date) => {
    const dias = ['Domingo', '2ª feira', '3ª feira', '4ª feira', '5ª feira', '6ª feira', 'Sábado'];
    return dias[data.getDay()];
  };

  const formatarTextosCalendario = (data: Date, textoOriginal: string | undefined, ehSelecionado: boolean) => {
    const diaSemana = getNomeDia(data);
    
    if (!textoOriginal || !ehSelecionado) {
      return { linha1: diaSemana, linha2: 'Liturgia Diária' };
    }

    let textoLimpo = textoOriginal;
    const regexDias = /^(Segunda-feira|Terça-feira|Quarta-feira|Quinta-feira|Sexta-feira|Sábado|Domingo|2ª feira|3ª feira|4ª feira|5ª feira|6ª feira)[\s,-]*/i;
    textoLimpo = textoLimpo.replace(regexDias, '').trim();

    if (textoLimpo) {
      textoLimpo = textoLimpo.charAt(0).toUpperCase() + textoLimpo.slice(1);
    } else {
      textoLimpo = 'Liturgia Diária';
    }

    return { linha1: diaSemana, linha2: textoLimpo };
  };

  const expandirLivroBiblico = (referenciaStr: string | undefined) => {
    if (!referenciaStr) return '';
    const match = referenciaStr.match(/^([1-3]?\s*[A-Za-zÀ-ÿ]+)\s*(.*)/);
    
    if (match) {
      const abrev = match[1].trim().replace(/\s+/g, '');
      const dicionarioLivros: Record<string, string> = {
        "Gn": "Gênesis", "Ex": "Êxodo", "Lv": "Levítico", "Nm": "Números", "Dt": "Deuteronômio",
        "Js": "Josué", "Jz": "Juízes", "Rt": "Rute", "1Sm": "1 Samuel", "2Sm": "2 Samuel",
        "1Rs": "1 Reis", "2Rs": "2 Reis", "1Cr": "1 Crônicas", "2Cr": "2 Crônicas",
        "Esd": "Esdras", "Ne": "Neemias", "Tb": "Tobias", "Jt": "Judite", "Est": "Ester",
        "1Mc": "1 Macabeus", "2Mc": "2 Macabeus", "Jó": "Jó", "Sl": "Salmo", "Pr": "Provérbios",
        "Ecl": "Eclesiastes", "Ct": "Cântico dos Cânticos", "Sb": "Sabedoria", "Eclo": "Eclesiástico",
        "Is": "Isaías", "Jr": "Jeremias", "Lm": "Lamentações", "Br": "Baruque", "Ez": "Ezequiel",
        "Dn": "Daniel", "Os": "Oseias", "Jl": "Joel", "Am": "Amós", "Ob": "Obadias", "Jn": "Jonas",
        "Mq": "Miqueias", "Na": "Naum", "Hc": "Habacuque", "Hab": "Habacuque", "Sf": "Sofonias", 
        "Ag": "Ageu", "Zc": "Zacarias", "Ml": "Malaquias",
        "Mt": "Mateus", "Mc": "Marcos", "Lc": "Lucas", "Jo": "João", "At": "Atos dos Apóstolos",
        "Rm": "Romanos", "1Cor": "1 Coríntios", "2Cor": "2 Coríntios", "Gl": "Gálatas", "Ef": "Efésios",
        "Fl": "Filipenses", "Fp": "Filipenses", "Cl": "Colossenses", "1Ts": "1 Tessalonicenses", 
        "2Ts": "2 Tessalonicenses", "1Tm": "1 Timóteo", "2Tm": "2 Timóteo", "Tt": "Tito", 
        "Fm": "Filemon", "Hb": "Hebreus", "Tg": "Tiago", "1Pe": "1 Pedro", "2Pe": "2 Pedro", 
        "1Jo": "1 João", "2Jo": "2 João", "3Jo": "3 João", "Jd": "Judas", "Ap": "Apocalipse"
      };

      const nomeExpandido = dicionarioLivros[abrev] || match[1].trim();
      return `${nomeExpandido} ${match[2]}`.trim();
    }
    return referenciaStr;
  };

  const anoVis = mesVisualizado.getFullYear();
  const mesVis = mesVisualizado.getMonth();
  const primeiroDiaMes = new Date(anoVis, mesVis, 1).getDay(); 
  const diasNoMes = new Date(anoVis, mesVis + 1, 0).getDate();

  const diasMatriz = [];
  for (let i = 0; i < primeiroDiaMes; i++) {
    diasMatriz.push(null);
  }
  for (let i = 1; i <= diasNoMes; i++) {
    diasMatriz.push(new Date(anoVis, mesVis, i));
  }

  if (!montado) {
    return <div className="min-h-screen bg-[#F2F2F2]"></div>;
  }

  const diaDaSemanaTopo = dataReferencia.toLocaleDateString('pt-BR', { weekday: 'long' });
  const diaNumTopo = String(dataReferencia.getDate()).padStart(2, '0');
  const mesesAbrev = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const mesTopo = mesesAbrev[dataReferencia.getMonth()];
  const corHexTopo = getCorLiturgicaHex(liturgia?.cor || '');

  return (
    // Mantido 'flex flex-col' para evitar o colapso de margem
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2] flex flex-col">
      
      {/* CONTEÚDO PRINCIPAL (pt-8 md:pt-12 no lugar de margem) */}
      <div className="max-w-md lg:max-w-[85rem] mx-auto pt-8 md:pt-12 px-6 w-full flex-1">
        
        {/* TOPO MOBILE */}
        <div className="md:hidden flex justify-between items-start mb-8 relative z-30">
          <div className="flex flex-col flex-1 pr-4">
            {liturgia ? (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[22px] font-black text-[#401D10] leading-none tracking-tight">
                    {diaNumTopo} {mesTopo}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${corHexTopo} shadow-sm ml-1`}></div>
                  <span className="text-xs font-bold text-[#592C1C] uppercase tracking-widest leading-none pt-0.5">
                    {liturgia.cor}
                  </span>
                </div>
                <h1 className="text-2xl font-serif font-bold text-[#401D10] leading-tight line-clamp-2">
                  {liturgia.liturgia}
                </h1>
              </>
            ) : (
              <h1 className="text-2xl font-serif font-bold text-[#401D10]">Buscando Liturgia...</h1>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1">
            {dataSelecionada && (
              <button onClick={() => router.push('/liturgia')} className="text-xs font-bold uppercase tracking-widest text-[#592C1C] bg-[#A6948D]/10 px-3 py-2 rounded-xl active:scale-95 transition-transform">
                Hoje
              </button>
            )}
            
            {/* BOTÃO QUE ABRE O NOVO POP-UP DO CALENDÁRIO (MOBILE) */}
            <button onClick={abrirCalendario} className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-[#A6948D]/30 text-[#592C1C] active:scale-95 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
          </div>
        </div>

        {/* TOPO DESKTOP */}
        <div className="hidden md:flex flex-col items-center text-center mb-10">
          <div className="flex items-center justify-center gap-8 mb-8 mt-2">
            {liturgia && (
              <div className="flex items-end gap-8">
                <div className="flex flex-col items-start text-left">
                  <span className="text-lg font-medium text-[#735A51] capitalize mb-1 leading-none">
                    {diaDaSemanaTopo}
                  </span>
                  <span className="text-[48px] font-black text-[#401D10] leading-none tracking-tighter uppercase">
                    {diaNumTopo} {mesTopo}
                  </span>
                </div>
                <div className="w-px h-8 bg-[#A6948D]/30"></div>
                <div className="flex items-center gap-2.5 pb-2">
                  <div className={`w-5 h-5 rounded-full ${corHexTopo} shadow-sm`}></div>
                  <span className="text-sm font-bold text-[#592C1C] uppercase tracking-wider">
                    {liturgia.cor}
                  </span>
                </div>
              </div>
            )}
          </div>
          <h1 className="text-5xl font-serif font-bold text-[#401D10] leading-tight max-w-3xl mx-auto">
            {liturgia ? liturgia.liturgia : 'Buscando Liturgia...'}
          </h1>
        </div>

        {!liturgia ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#A6948D] mt-10">
            <p className="text-[#735A51] font-medium text-lg animate-pulse">Carregando a liturgia da data selecionada...</p>
          </div>
        ) : (
          <>
            {/* ÍNDICE MOBILE */}
            <div className="lg:hidden flex overflow-x-auto gap-3 pb-2 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {indice.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-5 py-2 bg-[#A6948D]/20 text-[#592C1C] rounded-full text-sm font-bold whitespace-nowrap active:scale-95 transition-transform"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">
              
              {/* ESQUERDA: ÍNDICE */}
              <aside className="hidden lg:block sticky top-8 w-60 shrink-0">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A6948D]/20">
                  <div className="flex items-center gap-2 text-[#592C1C] mb-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    <h4 className="font-serif font-bold text-lg text-[#401D10]">Navegação</h4>
                  </div>
                  <nav className="flex flex-col gap-4 border-l-2 border-[#A6948D]/20 pl-4">
                    {indice.map((item) => (
                      <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-left text-[#735A51] hover:text-[#592C1C] font-medium text-sm transition-all hover:translate-x-1 focus:outline-none">
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* CENTRO: LITURGIA */}
              <div className="flex-1 w-full min-w-0 bg-white rounded-[2rem] shadow-sm border border-[#A6948D]/20 overflow-hidden">
                <section id="primeira-leitura" className="p-8 md:p-12 border-b border-[#A6948D]/20 scroll-mt-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#A6948D] uppercase tracking-wider mb-1">Primeira Leitura</h2>
                    <h3 className="text-2xl font-serif font-bold text-[#592C1C]">{expandirLivroBiblico(liturgia.primeiraLeitura?.referencia)}</h3>
                  </div>
                  <div className="text-[#401D10] text-lg md:text-xl leading-relaxed md:leading-loose font-serif whitespace-pre-wrap">{liturgia.primeiraLeitura?.texto}</div>
                </section>

                <section id="salmo" className="p-8 md:p-12 border-b border-[#A6948D]/20 bg-[#A6948D]/5 scroll-mt-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#A6948D] uppercase tracking-wider mb-1">Salmo Responsorial</h2>
                    <h3 className="text-2xl font-serif font-bold text-[#592C1C]">{expandirLivroBiblico(liturgia.salmo?.referencia)}</h3>
                  </div>
                  <div className="text-[#401D10] text-lg md:text-xl leading-relaxed md:leading-loose font-serif whitespace-pre-wrap font-medium italic">{liturgia.salmo?.texto}</div>
                </section>

                {liturgia.segundaLeitura && typeof liturgia.segundaLeitura !== 'string' && (
                  <section id="segunda-leitura" className="p-8 md:p-12 border-b border-[#A6948D]/20 scroll-mt-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-[#A6948D] uppercase tracking-wider mb-1">Segunda Leitura</h2>
                      <h3 className="text-2xl font-serif font-bold text-[#592C1C]">{expandirLivroBiblico((liturgia.segundaLeitura as Leitura).referencia)}</h3>
                    </div>
                    <div className="text-[#401D10] text-lg md:text-xl leading-relaxed md:leading-loose font-serif whitespace-pre-wrap">{(liturgia.segundaLeitura as Leitura).texto}</div>
                  </section>
                )}

                <section id="evangelho" className="p-8 md:p-12 scroll-mt-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#A6948D] uppercase tracking-wider mb-1">Evangelho</h2>
                    <h3 className="text-2xl font-serif font-bold text-[#592C1C]">{expandirLivroBiblico(liturgia.evangelho?.referencia)}</h3>
                  </div>
                  <div className="text-[#401D10] text-lg md:text-xl leading-relaxed md:leading-loose font-serif whitespace-pre-wrap">{liturgia.evangelho?.texto}</div>
                  <div className="mt-8 pt-8 border-t border-[#A6948D]/20 text-center text-[#735A51] font-serif italic">
                    — Palavra da Salvação. <br/> — Glória a vós, Senhor.
                  </div>
                </section>

                {reflexao && reflexao.texto && (
                  <section id="reflexao" className="p-8 md:p-12 border-t-[6px] border-[#592C1C] bg-[#A6948D]/10 relative overflow-hidden scroll-mt-6">
                    <svg className="absolute -right-4 -top-4 w-32 h-32 text-[#A6948D] opacity-10 transform rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                      <svg className="w-6 h-6 text-[#592C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      <h2 className="text-2xl font-serif font-bold text-[#401D10]">Reflexão da Fraternidade</h2>
                    </div>
                    <div className="text-[#401D10] text-lg md:text-xl leading-relaxed md:leading-loose font-serif whitespace-pre-wrap italic relative z-10">"{reflexao.texto}"</div>
                    {reflexao.autor && <div className="mt-8 text-right font-bold text-[#592C1C] uppercase tracking-wider text-sm relative z-10">— {reflexao.autor}</div>}
                  </section>
                )}
              </div>

              {/* DIREITA: CALENDÁRIO DESKTOP */}
              <aside className="hidden lg:block sticky top-8 w-72 shrink-0">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#A6948D]/20">
                  <div className="flex items-center justify-between mb-4 border-b border-[#A6948D]/20 pb-4">
                    <div className="flex items-center gap-2 text-[#592C1C]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <h4 className="font-serif font-bold text-lg text-[#401D10]">Datas</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {dataSelecionada && (
                        <button onClick={() => router.push('/liturgia')} className="text-[11px] font-bold uppercase tracking-widest text-[#592C1C] bg-[#A6948D]/10 hover:bg-[#A6948D]/20 px-2.5 py-1.5 rounded-lg transition-colors">
                          Hoje
                        </button>
                      )}
                      
                      {/* BOTÃO QUE ABRE O NOVO POP-UP (DESKTOP) */}
                      <button onClick={abrirCalendario} className="relative group cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#A6948D]/10 transition-colors">
                        <svg className="w-5 h-5 text-[#735A51] group-hover:text-[#592C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </button>

                    </div>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {diasCalendario.map((d, i) => {
                      const ehSelecionado = d.getTime() === dataReferencia.getTime(); 
                      const diaNum = d.getDate();
                      
                      const corBolinha = ehSelecionado ? getCorLiturgicaHex(liturgia?.cor || 'Verde') : 'bg-[#A6948D]/40';
                      const { linha1, linha2 } = formatarTextosCalendario(d, liturgia?.liturgia, ehSelecionado);

                      return (
                        <button
                          key={i}
                          onClick={() => navegarParaData(d)}
                          className={`flex items-start gap-4 p-3 rounded-xl transition-all text-left w-full group ${
                            ehSelecionado 
                              ? 'bg-[#A6948D]/10 ring-1 ring-[#A6948D]/30 shadow-sm' 
                              : 'hover:bg-[#A6948D]/5'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-start min-w-[2rem] pt-1">
                            <span className={`text-[22px] font-bold leading-none ${ehSelecionado ? 'text-[#401D10]' : 'text-[#735A51]'}`}>
                              {diaNum}
                            </span>
                            <div className={`w-[12px] h-[12px] rounded-full mt-2 ${corBolinha}`}></div>
                          </div>
                          
                          <div className="flex flex-col flex-1 pt-0.5">
                            <span className={`text-[15px] ${ehSelecionado ? 'text-[#401D10] font-semibold' : 'text-[#735A51] group-hover:text-[#401D10]'}`}>
                              {linha1}
                            </span>
                            <span className="text-[14px] text-[#A6948D] leading-tight mt-1 pr-1">
                              {linha2}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </aside>

            </div>
          </>
        )}
      </div>

      {/* =========================================
          NOVO MODAL POP-UP DE CALENDÁRIO
      ========================================= */}
      {modalCalendarioAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#401D10]/40 backdrop-blur-sm transition-opacity p-4">
          <div className="absolute inset-0" onClick={() => setModalCalendarioAberto(false)} />
          
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[340px] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header do Calendário */}
            <div className="flex justify-between items-center px-4 py-5 bg-[#F8F9FA] border-b border-[#E5E7EB]">
              <button onClick={mesAnterior} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h3 className="text-[17px] font-bold text-[#401D10] capitalize">
                {mesVisualizado.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={proximoMes} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Grid de Dias */}
            <div className="p-5">
              <div className="grid grid-cols-7 mb-4">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(dia => (
                  <div key={dia} className="text-[11px] font-bold text-gray-500 text-center tracking-wide">{dia}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-3 gap-x-1">
                {diasMatriz.map((dia, idx) => {
                  if (!dia) return <div key={`empty-${idx}`} />;
                  
                  const ehSelecionado = dia.getTime() === dataReferencia.getTime();
                  const ehHoje = dia.getTime() === hojeReal.getTime();
                  const ehDomingo = dia.getDay() === 0;

                  let bgClass = "bg-transparent hover:bg-gray-100";
                  let textClass = "text-[#401D10]";

                  if (ehSelecionado) {
                    bgClass = "bg-[#E5E5E5]"; 
                    textClass = "text-[#401D10]";
                  } else if (ehDomingo && ehHoje) {
                    bgClass = "bg-[#FFD6D6]"; 
                    textClass = "text-[#EF4444]";
                  } else if (ehDomingo) {
                    textClass = "text-[#EF4444]"; 
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center justify-center">
                      <button
                        onClick={() => {
                          navegarParaData(dia);
                          setModalCalendarioAberto(false);
                        }}
                        className={`flex flex-col items-center justify-center w-[40px] h-[44px] rounded-xl transition-colors ${bgClass}`}
                      >
                        <span className={`text-[15px] font-bold mt-1 ${textClass}`}>
                          {dia.getDate()}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full mt-0.5 opacity-0"></div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Rodapé Cancelar */}
            <div className="px-4 py-3 border-t border-[#E5E7EB] flex justify-end bg-[#F8F9FA]">
               <button onClick={() => setModalCalendarioAberto(false)} className="text-sm font-bold text-[#A6948D] hover:text-[#735A51] px-4 py-2 rounded-lg transition-colors">
                 Cancelar
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}