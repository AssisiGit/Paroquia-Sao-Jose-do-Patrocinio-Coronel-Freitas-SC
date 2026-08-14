'use client';

import { useState, useEffect } from 'react';

// Nova Interface para os Frades
interface Frade {
  nome: string;
  funcao: string;
  fotoUrl?: string;
  historia?: string;
}

// =========================================
// INTERFACE ATUALIZADA
// =========================================
interface DadosSobre {
  titulo?: string;
  imagemUrl?: string;
  linhaDoTempo?: {
    ano: string;
    texto: string;
    imagemUrl?: string;
  }[];
  fraternidade?: Frade[];
  horarioSecretaria?: string;
  telefone?: string;
  whatsapp?: string;
  endereco?: string;
}

export default function SobreClient({ dados }: { dados: DadosSobre | null }) {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [fradeSelecionado, setFradeSelecionado] = useState<Frade | null>(null);
  const [imagemExpandida, setImagemExpandida] = useState<string | null>(null);

  // =========================================
  // EFEITO MÁGICO: Trava o Scroll e Esconde o Header
  // =========================================
  useEffect(() => {
    // Procura a tag <header> ou <nav> do seu layout original
    const menuHeader = document.querySelector('header') || document.querySelector('nav') as HTMLElement;

    if (fradeSelecionado || imagemExpandida) {
      // Trava a rolagem da tela
      document.body.style.overflow = 'hidden';
      // Esconde o menu para não atrapalhar o pop-up
      if (menuHeader) menuHeader.style.visibility = 'hidden';
    } else {
      // Destrava a rolagem
      document.body.style.overflow = 'auto';
      // Mostra o menu de volta
      if (menuHeader) menuHeader.style.visibility = 'visible';
    }

    // Limpeza de segurança (caso mude de página do nada)
    return () => {
      document.body.style.overflow = 'auto';
      if (menuHeader) menuHeader.style.visibility = 'visible';
    };
  }, [fradeSelecionado, imagemExpandida]);

  return (
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2]">
      
      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-md md:max-w-6xl mx-auto pt-4 md:pt-12 px-6">
        
        {/* TOPO MOBILE */}
        <div className="md:hidden flex justify-between items-start pt-12 mb-8 relative z-30">
          <h1 className="text-3xl font-bold text-[#401D10] leading-tight tracking-tight">Sobre a<br />Paróquia</h1>
          <button onClick={() => setMenuAberto(true)} className="w-11 h-11 flex items-center justify-center rounded-full bg-[#401D10] text-[#F2F2F2] shadow-md">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </div>

        {/* TÍTULO DESKTOP */}
        <div className="hidden md:block mb-12 text-center">
          <h1 className="text-5xl font-bold font-merriweather text-[#401D10] tracking-tight mb-4">{dados?.titulo || 'Sobre a Paróquia'}</h1>
        </div>

        {/* IMAGEM DA MATRIZ */}
        {dados?.imagemUrl && (
          <div className="w-full h-64 md:h-[500px] mb-16 rounded-3xl overflow-hidden shadow-sm border border-[#A6948D]/20">
            <img src={dados.imagemUrl} alt="Foto da Paróquia" className="w-full h-full object-cover" />
          </div>
        )}

        {/* =========================================
            SESSÃO: FRATERNIDADE
        ========================================= */}
        {dados?.fraternidade && dados.fraternidade.length > 0 && (
          <div className="mb-20">
            <div className="mb-10 text-center md:text-left">
              <span className="flex items-center justify-center md:justify-start gap-2 text-[#A6948D] font-bold tracking-widest uppercase text-sm mb-2">
                <span className="w-2 h-2 rounded-full bg-[#592C1C]"></span>
                Nossos Frades
              </span>
              <h2 className="text-4xl font-breeSerif font-bold text-[#401D10]">Conheça a Fraternidade</h2>
              <p className="text-[#735A51] mt-3 text-lg">Os frades que guiam e animam a vida pastoral da nossa paróquia.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dados.fraternidade.map((frade, index) => (
                <div 
                  key={index} 
                  onClick={() => setFradeSelecionado(frade)}
                  className="relative rounded-[2rem] overflow-hidden bg-[#A6948D]/20 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-80 md:h-[400px] w-full">
                    {frade.fotoUrl ? (
                      <img src={frade.fotoUrl} alt={frade.nome} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#735A51] bg-[#F2F2F2]">Sem foto</div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-5 rounded-2xl flex justify-between items-center transform transition-transform duration-300 group-hover:-translate-y-1 shadow-lg">
                    <div>
                      <h3 className="font-breeSerif font-bold text-xl text-[#401D10]">{frade.nome}</h3>
                      <p className="text-sm font-medium text-[#A6948D] uppercase tracking-wider mt-1">{frade.funcao}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#592C1C] group-hover:bg-[#592C1C] group-hover:text-white transition-colors flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            SEÇÃO: LINHA DO TEMPO
        ========================================= */}
        {dados?.linhaDoTempo && dados.linhaDoTempo.length > 0 && (
          <section className="py-16 md:py-24 bg-[#F2F2F2] rounded-[3rem] border border-[#A6948D]/10">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-breeSerif font-bold text-[#401D10] mb-4">Nossa História</h2>
                <p className="text-[#735A51] text-lg max-w-2xl mx-auto">
                  Conheça os marcos que construíram a Paróquia São José do Patrocínio.
                </p>
              </div>

              <div className="relative mx-auto max-w-5xl px-4 md:px-0 mt-10">
                <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 border-l-[3px] border-dashed border-[#A6948D]/60 -translate-x-1/2"></div>

                {dados.linhaDoTempo.map((item, index) => {
                  const isPar = index % 2 === 0;

                  return (
                    <div key={index} className={`flex w-full mb-16 md:mb-24 ${isPar ? 'md:justify-start' : 'md:justify-end'} justify-end relative`}>
                      <div className="absolute left-[30px] md:left-1/2 top-3 w-6 h-6 -translate-x-1/2 rounded-full bg-[#592C1C] border-[4px] border-[#F2F2F2] shadow-sm z-10"></div>

                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-4rem)] relative text-left">
                        <h3 className="text-5xl md:text-6xl font-black font-ebgaramond text-[#401D10] tracking-tighter leading-none mb-3">
                          {item.ano}
                        </h3>
                        <p className="text-[#735A51] text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                          {item.texto}
                        </p>

                        {item.imagemUrl && (
                          <div 
                            onClick={() => setImagemExpandida(item.imagemUrl!)}
                            className="mt-6 rounded-2xl overflow-hidden shadow-lg border-2 border-[#A6948D]/20 max-w-md w-full cursor-pointer group relative"
                          >
                            <img 
                              src={item.imagemUrl} 
                              alt={`Acontecimento do ano ${item.ano}`} 
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-[#401D10]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="bg-white/90 p-3 rounded-full text-[#401D10] transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </div>

      {/* =========================================
          MODAIS COM Z-INDEX MÁXIMO
      ========================================= */}
      
      {/* MODAL DA IMAGEM */}
      {imagemExpandida && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={() => setImagemExpandida(null)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setImagemExpandida(null)}
              className="absolute -top-12 right-0 md:-right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img 
              src={imagemExpandida} 
              alt="Imagem expandida" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" 
            />
          </div>
        </div>
      )}

      {/* MODAL DO FRADE */}
      {fradeSelecionado && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#401D10]/80 backdrop-blur-sm" onClick={() => setFradeSelecionado(null)}>
          <div 
            className="bg-[#F2F2F2] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setFradeSelecionado(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#735A51] hover:bg-[#A6948D]/20 transition-colors z-20 shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-start mt-4 md:mt-0">
              {fradeSelecionado.fotoUrl && (
                <div className="w-full md:w-2/5 flex-shrink-0">
                  <div className="bg-white p-2 md:p-3 rounded-3xl shadow-md border border-[#A6948D]/20">
                    <img 
                      src={fradeSelecionado.fotoUrl} 
                      alt={fradeSelecionado.nome} 
                      className="w-full h-auto max-h-[400px] md:max-h-[500px] object-contain rounded-2xl mx-auto" 
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 w-full md:pt-4">
                <span className="inline-block bg-[#592C1C] text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-sm">
                  {fradeSelecionado.funcao}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#401D10] mb-6 leading-tight">
                  {fradeSelecionado.nome}
                </h2>
                <div className="text-[#735A51] text-lg leading-relaxed whitespace-pre-wrap font-serif">
                  {fradeSelecionado.historia ? fradeSelecionado.historia : 'A biografia deste frade ainda não foi adicionada no sistema.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}