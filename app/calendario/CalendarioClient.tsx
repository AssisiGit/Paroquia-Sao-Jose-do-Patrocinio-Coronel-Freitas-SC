'use client';

import { useState, useMemo } from 'react';
import { format, isToday, isTomorrow, addDays, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

export default function CalendarioClient({ eventosSanity }: { eventosSanity: any[] }) {
  const [abaAtiva, setAbaAtiva] = useState<'hoje' | 'amanha' | 'mes' | 'data'>('hoje');
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [mesAtual, setMesAtual] = useState<Date>(new Date());

  // Estados do Modal de Calendário Customizado
  const [modalCalendarioAberto, setModalCalendarioAberto] = useState<boolean>(false);
  const [mesVisualizado, setMesVisualizado] = useState<Date>(new Date());

  const obterCores = (tipo: string) => {
    const paleta: Record<string, any> = {
      missa: {
        bgCard: 'bg-[#8C6E49]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/90', badge: 'bg-[#401D10]/20 text-[#F2F2F2]'
      },
      formacao: {
        bgCard: 'bg-[#402208]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]'
      },
      reuniao: { 
        bgCard: 'bg-[#402208]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]'
      },
      festa: {
        bgCard: 'bg-[#593508]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]'
      },
      evento: { 
        bgCard: 'bg-[#593508]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]'
      },
      pastorais: { 
        bgCard: 'bg-[#735A51]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/15 text-[#F2F2F2]'
      }
    };
    
    const tipoFormatado = tipo ? tipo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    
    return paleta[tipoFormatado] || {
      bgCard: 'bg-[#592C1C]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#A6948D]', badge: 'bg-[#401D10] text-[#F2F2F2]'
    };
  };

  const eventosFiltrados = useMemo(() => {
    return eventosSanity.filter((evento) => {
      const dataEvento = new Date(evento.dataInicio);
      if (abaAtiva === 'hoje') return isToday(dataEvento);
      if (abaAtiva === 'amanha') return isTomorrow(dataEvento);
      if (abaAtiva === 'mes') return dataEvento.getMonth() === mesAtual.getMonth() && dataEvento.getFullYear() === mesAtual.getFullYear();
      if (abaAtiva === 'data' && dataSelecionada) {
        return format(dataEvento, 'yyyy-MM-dd') === dataSelecionada;
      }
      return true;
    });
  }, [eventosSanity, abaAtiva, dataSelecionada, mesAtual]);

  const eventosAgrupadosPorDia = useMemo(() => {
    if (abaAtiva !== 'mes') return null;
    const grupos: Record<string, any[]> = {};
    eventosFiltrados.forEach(evento => {
      const dataFormatada = format(new Date(evento.dataInicio), "EEEE, dd 'de' MMMM", { locale: ptBR });
      if (!grupos[dataFormatada]) grupos[dataFormatada] = [];
      grupos[dataFormatada].push(evento);
    });
    return grupos;
  }, [eventosFiltrados, abaAtiva]);

  const dataCabecalho = useMemo(() => {
    if (abaAtiva === 'amanha') return addDays(new Date(), 1);
    if (abaAtiva === 'data' && dataSelecionada) return new Date(`${dataSelecionada}T12:00:00`);
    return new Date();
  }, [abaAtiva, dataSelecionada]);

  // =========================================
  // LÓGICAS DO MODAL DE CALENDÁRIO
  // =========================================
  const dataRefSelecionada = dataSelecionada ? new Date(dataSelecionada + 'T00:00:00') : null;

  const abrirCalendario = () => {
    setMesVisualizado(dataRefSelecionada ? new Date(dataRefSelecionada) : new Date());
    setModalCalendarioAberto(true);
  };

  const mesAnterior = () => {
    setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() - 1, 1));
  };

  const proximoMes = () => {
    setMesVisualizado(new Date(mesVisualizado.getFullYear(), mesVisualizado.getMonth() + 1, 1));
  };

  const selecionarDataNoModal = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    setDataSelecionada(`${ano}-${mes}-${dia}`);
    setAbaAtiva('data');
    setModalCalendarioAberto(false);
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

  return (
    <div className="relative min-h-screen pb-10 font-sans bg-[#F2F2F2] flex flex-col">
      
      {/* =========================================
          CONTAINER PRINCIPAL DO CALENDÁRIO
      ========================================= */}
      <div className="max-w-md md:max-w-4xl mx-auto pt-8 md:pt-12 w-full flex-1">
        
        {/* TÍTULO DA PÁGINA */}
        <div className="text-center px-6 mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#401D10] tracking-tight mb-3">
            Calendário Paroquial
          </h1>
          <p className="text-sm md:text-lg text-[#735A51] max-w-xl mx-auto">
            Acompanhe os horários de missas, formações, eventos e reuniões de toda a paróquia.
          </p>
        </div>
               
        {/* FILTROS */}
        <div className="px-6 pt-2 pb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide items-center justify-center md:justify-start">
            <button onClick={() => setAbaAtiva('hoje')} className={`px-5 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${abaAtiva === 'hoje' ? 'bg-[#401D10] text-[#F2F2F2] shadow-sm' : 'bg-[#A6948D]/20 text-[#735A51] hover:bg-[#A6948D]/30'}`}>
              Hoje
            </button>
            <button onClick={() => setAbaAtiva('amanha')} className={`px-5 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${abaAtiva === 'amanha' ? 'bg-[#401D10] text-[#F2F2F2] shadow-sm' : 'bg-[#A6948D]/20 text-[#735A51] hover:bg-[#A6948D]/30'}`}>
              Amanhã
            </button>
            <button onClick={() => setAbaAtiva('mes')} className={`px-5 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${abaAtiva === 'mes' ? 'bg-[#401D10] text-[#F2F2F2] shadow-sm' : 'bg-[#A6948D]/20 text-[#735A51] hover:bg-[#A6948D]/30'}`}>
              Mensal
            </button>

            {/* BOTÃO DO CALENDÁRIO CUSTOMIZADO */}
            <div className="relative flex-shrink-0 ml-1">
              <button 
                onClick={abrirCalendario} 
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors active:scale-95 ${abaAtiva === 'data' ? 'bg-[#401D10] text-[#F2F2F2] shadow-sm' : 'bg-[#A6948D]/20 text-[#735A51] hover:bg-[#A6948D]/30'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navegação de 3 Meses */}
          {abaAtiva === 'mes' && (
            <div className="flex justify-between items-center py-3 px-6 bg-white rounded-2xl shadow-sm border border-[#A6948D]/30 mt-4 mx-auto max-w-md">
              <button onClick={() => setMesAtual(subMonths(mesAtual, 1))} className="text-sm font-bold text-[#A6948D] hover:text-[#401D10] transition-colors w-12 text-left">
                {format(subMonths(mesAtual, 1), 'MMM', { locale: ptBR }).toUpperCase()}
              </button>
              
              <span className="text-lg font-bold text-[#401D10] capitalize px-4 border-x border-[#A6948D]/30">
                {format(mesAtual, 'MMMM', { locale: ptBR })}
              </span>

              <button onClick={() => setMesAtual(addMonths(mesAtual, 1))} className="text-sm font-bold text-[#A6948D] hover:text-[#401D10] transition-colors w-12 text-right">
                {format(addMonths(mesAtual, 1), 'MMM', { locale: ptBR }).toUpperCase()}
              </button>
            </div>
          )}
        </div>

        {/* ÁREA DE CONTEÚDO */}
        <div className="px-6">
          {eventosFiltrados.length === 0 ? (
            <div className="text-center py-12 mt-4 bg-white/50 rounded-3xl border border-dashed border-[#A6948D]">
              <p className="text-[#735A51] font-medium">Nenhum evento programado para este período.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* VISÃO DIA ÚNICO */}
              {(abaAtiva === 'hoje' || abaAtiva === 'amanha' || abaAtiva === 'data') && (
                <div className="space-y-4">
                  <div className="mb-8 md:mb-10 pl-2 text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-medium text-[#735A51] capitalize">
                      {format(dataCabecalho, 'EEEE', { locale: ptBR })}
                    </h3>
                    <p className="text-4xl md:text-5xl font-bold text-[#401D10] tracking-tight">
                      {format(dataCabecalho, 'dd MMM', { locale: ptBR }).toUpperCase()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eventosFiltrados.map((evento) => {
                      const cores = obterCores(evento.tipo);
                      return (
                        <div key={evento._id} className={`${cores.bgCard} ${cores.textCard} p-6 rounded-3xl shadow-md relative overflow-hidden transition-transform hover:-translate-y-1 duration-300`}>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 inline-block shadow-sm ${cores.badge}`}>
                            {evento.tipo}
                          </span>
                          
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xl md:text-2xl font-serif font-medium pr-4 leading-tight">{evento.titulo}</h4>
                            <span className={`${cores.textHora} font-light text-2xl md:text-3xl tracking-tight`}>
                              {format(new Date(evento.dataInicio), 'HH:mm')}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5 text-sm md:text-base mt-6 opacity-90">
                            <p className="flex items-center gap-2">📍 {evento.local}</p>
                            {evento.freiCelebrante && (
                              <p className="flex items-center gap-2">✝ {evento.freiCelebrante}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VISÃO AGRUPADA (MENSAL) */}
              {abaAtiva === 'mes' && eventosAgrupadosPorDia && (
                <div className="space-y-8 md:space-y-12">
                  {Object.entries(eventosAgrupadosPorDia).map(([dia, eventosDoDia]) => (
                    <div key={dia}>
                      <h3 className="text-sm md:text-base font-bold text-[#735A51] capitalize mb-4 tracking-wider border-b border-[#A6948D]/30 pb-2">
                        {dia}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eventosDoDia.map((evento) => {
                          const cores = obterCores(evento.tipo);
                          const isMissa = evento.tipo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 'missa';
                          
                          return (
                            <div key={evento._id} className={`${cores.bgCard} ${cores.textCard} p-5 rounded-2xl shadow-sm flex justify-between items-center transition-transform hover:shadow-md duration-300 hover:-translate-y-0.5`}>
                              <div>
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mb-2 inline-block ${cores.badge}`}>
                                  {evento.tipo}
                                </span>
                                <h4 className="font-serif text-lg md:text-xl leading-tight">{evento.titulo}</h4>
                                <p className={`text-xs md:text-sm mt-1.5 opacity-80`}>{evento.local}</p>
                                
                                {isMissa && evento.freiCelebrante && (
                                  <p className="text-xs md:text-sm mt-1 opacity-80 flex items-center gap-1.5">
                                    ✝ {evento.freiCelebrante}
                                  </p>
                                )}
                              </div>
                              <div className="text-right pl-4">
                                <span className={`${cores.textHora} text-xl md:text-2xl font-light tracking-tight`}>
                                  {format(new Date(evento.dataInicio), 'HH:mm')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          MODAL POP-UP DO CALENDÁRIO (Design Atualizado)
      ========================================= */}
      {modalCalendarioAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Fundo escuro */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalCalendarioAberto(false)}></div>
          
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
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((dia, idx) => (
                  <div key={idx} className="text-center text-[10px] font-bold text-[#735A51] tracking-wider">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Números */}
              <div className="grid grid-cols-7 gap-y-4 text-center">
                {diasMatriz.map((dia, index) => {
                  if (!dia) return <div key={index}></div>;
                  
                  const isDomingo = index % 7 === 0;
                  
                  return (
                    <div key={index} className="flex justify-center">
                      <button 
                        onClick={() => selecionarDataNoModal(dia)}
                        className={`w-8 h-8 flex items-center justify-center font-bold rounded-full hover:bg-[#F2F2F2] transition-colors
                          ${isDomingo ? 'text-[#E53E3E]' : 'text-[#401D10]'}
                        `}
                      >
                        {dia.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer: Cancelar */}
            <div className="bg-[#FAFAFA] border-t border-[#A6948D]/10 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setModalCalendarioAberto(false)}
                className="font-bold text-[#A6948D] hover:text-[#401D10] transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}