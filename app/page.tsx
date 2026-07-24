import Link from 'next/link';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
// ATENÇÃO: Verifique se o caminho de importação do seu client do Sanity está correto
import { client } from '../lib/sanity'; 
import { urlFor } from '..//lib/image';

// =========================================
// FUNÇÕES DE BUSCA NO SANITY
// =========================================
async function getUltimasNoticias() {
  const query = `*[_type == "noticia"] | order(dataPublicacao desc)[0...4] {
    _id,
    titulo,
    resumo,
    dataPublicacao,
    imagemDestaque, // Pegamos o objeto inteiro da imagem
    "slug": slug.current
  }`;
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}
async function getProximosEventos() {
  // Pega eventos a partir de ontem para garantir que problemas de fuso horário não escondam os de hoje
  const query = `*[_type == "evento" && dataInicio >= $ontem] | order(dataInicio asc)[0...15] {
    _id,
    titulo,
    tipo,
    dataInicio,
    local,
    freiCelebrante
  }`;
  
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  
  return client.fetch(query, { ontem: ontem.toISOString() }, { next: { revalidate: 60 } });
}

// Lógica de cores (A mesma do calendário)
const obterCores = (tipo: string) => {
  const paleta: Record<string, any> = {
    missa: { bgCard: 'bg-[#8C6E49]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/90', badge: 'bg-[#401D10]/20 text-[#F2F2F2]' },
    formacao: { bgCard: 'bg-[#402208]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]' },
    reuniao: { bgCard: 'bg-[#402208]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]' },
    festa: { bgCard: 'bg-[#593508]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]' },
    evento: { bgCard: 'bg-[#593508]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/10 text-[#F2F2F2]' },
    pastorais: { bgCard: 'bg-[#735A51]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#F2F2F2]/80', badge: 'bg-[#F2F2F2]/15 text-[#F2F2F2]' }
  };
  const tipoFormatado = tipo ? tipo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  return paleta[tipoFormatado] || { bgCard: 'bg-[#592C1C]', textCard: 'text-[#F2F2F2]', textHora: 'text-[#A6948D]', badge: 'bg-[#401D10] text-[#F2F2F2]' };
};

export default async function Home() {
  // Busca os dados simultaneamente para ser mais rápido
  const [noticias, todosEventos] = await Promise.all([
    getUltimasNoticias(),
    getProximosEventos()
  ]);

  // Filtra apenas os eventos que acontecem Hoje ou Amanhã
  const eventosHojeAmanha = todosEventos.filter((evento: any) => {
    const dataEvento = new Date(evento.dataInicio);
    return isToday(dataEvento) || isTomorrow(dataEvento);
  });

  return (
    <div className="relative min-h-screen font-sans bg-[#F2F2F2] flex flex-col overflow-x-hidden">
      
      {/* =========================================
          HERO (FOTO METADE DA TELA COM SOMBRA)
      ========================================= */}
      <section className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* NÃO usamos lazy loading aqui pois é a imagem principal que já aparece ao abrir o site (LCP) */}
        <img 
          src="/index1.png" 
          alt="Fachada da Paróquia São José do Patrocínio" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#401D10] via-[#401D10]/10 to-transparent"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 text-center px-4 md:px-6 w-full flex flex-col items-center justify-center pt-10">
          <span className="text-[#A6948D] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4 block drop-shadow-md">
            Bem-vindo à
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight drop-shadow-2xl max-w-4xl">
            Paróquia São José <br className="hidden md:block" />
            <span className="text-[#F2F2F2]">do Patrocínio</span>
          </h1>
        </div>
      </section>

      {/* =========================================
          SEÇÃO 1: LOGO E DESCRIÇÃO DA PARÓQUIA
      ========================================= */}
      <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="w-48 sm:w-56 md:w-80 shrink-0">
              <img 
                src="/Tau4.svg" 
                alt="Logo Paróquia" 
                loading="lazy" 
                className="w-full h-auto object-contain mx-auto scale-125 md:scale-150 transform transition-transform" 
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#401D10] mb-4 md:mb-6 leading-tight">
                Uma comunidade de fé, <br className="hidden md:block" />
                esperança e caridade.
              </h2>
            <p className="text-[#735A51] text-base md:text-lg lg:text-xl leading-relaxed font-serif">
              Somos uma rede viva de comunidades unidas pelo amor de Cristo e inspiradas 
              pelos exemplos de São José e São Francisco de Assis. Aqui, buscamos acolher 
              cada irmão, vivenciar a Palavra e celebrar os sacramentos em fraternidade. 
              Sinta-se em casa, a paróquia é sua!
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          SEÇÃO 2: CARRETEL DE NOTÍCIAS (DADOS REAIS)
      ========================================= */}
      <section className="py-12 w-full max-w-7xl mx-auto overflow-hidden">
        <div className="flex justify-between items-end mb-8 px-6 md:px-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#401D10]">Últimas Notícias</h2>
          <Link href="/noticias" className="text-[#592C1C] font-bold hover:text-[#401D10] transition-colors flex items-center gap-1 text-sm md:text-base hidden sm:flex shrink-0">
            Ver todas
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-2 px-6 md:px-8 snap-x snap-mandatory scrollbar-hide w-full">
          {noticias.length > 0 ? (
            noticias.map((noticia: any) => (
              <Link 
                key={noticia._id} 
                href={`/noticias/${noticia.slug}`} 
                className="snap-start shrink-0 w-[85vw] sm:w-[280px] md:w-[320px] bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#A6948D]/20 group flex flex-col"
              >
                {/* Bloco da Imagem */}
                <div className="h-40 md:h-48 bg-[#A6948D]/20 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#A6948D]/10 group-hover:bg-transparent transition-colors z-10"></div>
                  
                  {noticia.imagemDestaque ? (
                    <img 
                      // Adicionado .format('webp') para super compressão e loading="lazy"
                      src={urlFor(noticia.imagemDestaque).width(600).format('webp').url()} 
                      alt={noticia.titulo} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A6948D]">
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bloco do Texto */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <time className="text-[11px] md:text-xs font-bold text-[#A6948D] mb-2 uppercase tracking-wider">
                    {format(new Date(noticia.dataPublicacao), "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </time>
                  <h3 className="text-lg md:text-xl font-serif font-bold text-[#401D10] mb-3 group-hover:text-[#592C1C] transition-colors leading-tight line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-[#735A51] text-sm line-clamp-2 mb-4 flex-1">
                    {noticia.resumo}
                  </p>
                  <span className="text-[#592C1C] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                    Ler matéria <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[#735A51] italic px-2">Nenhuma notícia recente publicada.</p>
          )}
        </div>
      </section>

      {/* =========================================
          SEÇÃO 3: CARRETEL DE EVENTOS (DADOS REAIS)
      ========================================= */}
      <section className="py-12 w-full max-w-7xl mx-auto overflow-hidden">
        <div className="bg-[#A6948D]/5 rounded-none md:rounded-[3rem] border-y md:border border-[#A6948D]/20 py-12 mb-12">
          <div className="flex justify-between items-end mb-8 px-6 md:px-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#401D10] mb-2">Próximos Eventos</h2>
              <p className="text-[#735A51] font-medium text-sm md:text-base">A programação de hoje e amanhã</p>
            </div>
            <Link href="/calendario" className="text-[#592C1C] font-bold hover:text-[#401D10] transition-colors flex items-center gap-1 text-sm md:text-base hidden sm:flex shrink-0">
              Ver calendário
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 px-6 md:px-10 snap-x snap-mandatory scrollbar-hide w-full">
            {eventosHojeAmanha.length > 0 ? (
              eventosHojeAmanha.map((evento: any) => {
                const cores = obterCores(evento.tipo);
                const isMissa = evento.tipo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 'missa';
                const dataEvt = new Date(evento.dataInicio);
                const rotuloDia = isToday(dataEvt) ? 'Hoje' : 'Amanhã';

                return (
                  <div key={evento._id} className={`snap-start shrink-0 w-[80vw] sm:w-[260px] md:w-[300px] ${cores.bgCard} ${cores.textCard} p-6 rounded-3xl shadow-md transition-transform hover:-translate-y-1 duration-300`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 inline-block shadow-sm ${cores.badge}`}>
                      {evento.tipo}
                    </span>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg md:text-xl font-serif font-medium pr-2 md:pr-4 leading-tight">{evento.titulo}</h4>
                      <span className={`${cores.textHora} font-light text-xl md:text-2xl tracking-tight`}>
                        {format(dataEvt, 'HH:mm')}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs md:text-sm mt-4 opacity-90">
                      <p className="flex items-center gap-2">📅 {rotuloDia}</p>
                      <p className="flex items-center gap-2">📍 {evento.local}</p>
                      {isMissa && evento.freiCelebrante && (
                        <p className="flex items-center gap-2 mt-1">✝ {evento.freiCelebrante}</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-[#735A51] font-medium bg-white/50 inline-block px-6 py-3 rounded-2xl border border-dashed border-[#A6948D]">
                  Nenhum evento programado para hoje ou amanhã.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 px-6 text-center sm:hidden">
            <Link href="/calendario" className="inline-block px-6 py-3 bg-[#A6948D]/20 text-[#592C1C] font-bold rounded-xl active:scale-95 transition-transform text-sm w-full">
              Ver calendário completo
            </Link>
          </div>
        </div>
      </section>

       {/* =========================================
          SEÇÃO 4: LITURGIA E VELAS
      ========================================= */}
      <section className="py-6 md:py-12 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#A6948D]/20 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#401D10]/10 rounded-full flex items-center justify-center text-[#592C1C] mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#401D10] mb-3 md:mb-4">Liturgia Diária</h3>
            <p className="text-[#735A51] mb-8 leading-relaxed text-sm md:text-base">
              Acompanhe as leituras, o salmo e o evangelho do dia para nutrir sua espiritualidade com a Palavra de Deus.
            </p>
            <Link href="/liturgia" className="mt-auto px-8 py-3.5 bg-[#401D10] text-white font-bold rounded-2xl hover:bg-[#592C1C] transition-colors w-full sm:w-auto text-sm md:text-base">
              Ler a Liturgia de Hoje
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#592C1C] to-[#401D10] p-8 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center text-[#F2F2F2] mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3 md:mb-4">Vela Virtual</h3>
            <p className="text-white/80 mb-8 leading-relaxed text-sm md:text-base">
              Acenda uma vela e deixe sua intenção em nosso site. Sua prece ficará acesa espiritualmente por 9 dias em nossa novena.
            </p>
            <Link href="/velas" className="mt-auto px-8 py-3.5 bg-white text-[#401D10] font-bold rounded-2xl hover:bg-[#F2F2F2] transition-colors w-full sm:w-auto text-sm md:text-base">
              Acender uma Vela
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================
          SEÇÃO 5: CONHEÇA A PARÓQUIA E SECRETARIA
      ========================================= */}
      <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#401D10] text-center mb-8 md:mb-12">Nossa Estrutura</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          
          {/* CAIXA 1: HISTÓRIA (Fica na Esquerda) */}
          <Link href="/sobre" className="relative h-full min-h-[320px] rounded-[2.5rem] overflow-hidden group shadow-sm">
            <img 
              src="/index2.png" 
              alt="Igreja por dentro" 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#401D10] via-[#401D10]/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">Conheça nossa História</h3>
              <p className="text-white/80 font-medium flex items-center gap-2 text-sm md:text-base">
                Nossos frades, padroeiro e caminhada
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </p>
            </div>
          </Link>

          {/* CAIXA 2: SECRETARIA (Fica no Meio - Mantendo layout dividido) */}
          <div className="bg-gradient-to-br from-[#592C1C] to-[#401D10] p-6 xl:p-8 rounded-[2.5rem] shadow-sm flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8 group hover:shadow-xl transition-all duration-300 h-full">
            
            {/* Título e Ícone */}
            <div className="flex flex-col items-center justify-center text-center shrink-0">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-[#F2F2F2] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-4">Secretaria</h3>
              
              <a href="https://wa.me/5549988141513?text=Olá%20Gostaria%20de%20falar%20com%20a%20Secretária%20da%20Paróquia." target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-white text-[#401D10] font-bold rounded-xl hover:bg-[#F2F2F2] transition-colors text-sm w-full shadow-sm hidden xl:block text-center">
                Falar Agora
              </a>
            </div>

            {/* Informações detalhadas (Horário, Endereço, etc) */}
            <div className="text-white/80 leading-relaxed text-sm flex flex-col justify-center gap-4 flex-1 w-full text-center xl:text-left">
              
              <div className="border-b border-white/10 pb-3">
                <span className="block font-serif font-bold text-base text-white mb-1">🕗 Horário</span>
                <span>08h às 11:30 | 13:30 às 17:30</span>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="block font-serif font-bold text-base text-white mb-1">📍 Endereço</span>
                <span>R. Iguaçu, 130, Coronel Freitas - SC, 89840-000</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="border-b xl:border-none border-white/10 pb-3 xl:pb-0">
                  <span className="block font-serif font-bold text-base text-white mb-1">📞 Contatos</span>
                  <span>Fixo: (49) 3347-0236  </span>
                  <span>Whats: (49) 98814-1513</span>
               
                </div>
                <div>
                  <span className="block font-serif font-bold text-base text-white mb-1">✉️ E-mail</span>
                  <a href="pcoronelfreitas@yahoo.com.br" className="hover:text-white hover:underline transition-colors break-words">
                    pcoronelfreitas@yahoo.com.br
                  </a>
                </div>
              </div>

              <a href="https://wa.me/5549988141513" target="_blank" rel="noopener noreferrer" className="mt-2 px-6 py-3 bg-white text-[#401D10] font-bold rounded-xl hover:bg-[#F2F2F2] transition-colors text-sm w-full shadow-sm xl:hidden text-center">
                Chamar no WhatsApp
              </a>

            </div>
          </div>

          {/* CAIXA 3: COMUNIDADES (Fica na Direita) */}
          <Link href="/comunidades" className="relative h-full min-h-[320px] rounded-[2.5rem] overflow-hidden group shadow-sm">
            <img 
              src="/index3.png" 
              alt="Pessoas na igreja" 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#401D10] via-[#401D10]/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">Nossas Comunidades</h3>
              <p className="text-white/80 font-medium flex items-center gap-2 text-sm md:text-base">
                Encontre a igreja mais próxima de você
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </p>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}