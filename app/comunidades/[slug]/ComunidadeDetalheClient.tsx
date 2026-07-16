// app/comunidades/[slug]/ComunidadeDetalheClient.tsx
'use client';

interface Comunidade {
  _id: string;
  nome: string;
  padroeiro?: string;
  imagemUrl?: string;
  endereco?: string;
  linkMaps?: string;
  horario?: string;
  historia?: string;
}

export default function ComunidadeDetalheClient({ comunidade }: { comunidade: Comunidade }) {
  
  return (
    // 'flex flex-col' evita o colapso de margem e o vazamento do fundo preto
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2] flex flex-col">
      
      {/* =========================================
          CONTEÚDO DA COMUNIDADE
          (Trocado 'mt-4 md:mt-12' por 'pt-8 md:pt-12' e adicionado 'w-full flex-1')
      ========================================= */}
      <div className="max-w-md md:max-w-4xl mx-auto pt-8 md:pt-12 px-6 w-full flex-1">
        
        {/* TOPO MOBILE (Botão Voltar) */}
        <div className="md:hidden flex justify-between items-start mb-8 relative z-30">
          <a href="/comunidades" className="text-[#735A51] hover:text-[#401D10] transition-colors font-medium flex items-center gap-1.5 bg-[#A6948D]/10 px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </a>
        </div>

        {/* Link voltar Desktop */}
        <div className="hidden md:block mb-8">
          <a href="/comunidades" className="text-[#735A51] hover:text-[#401D10] transition-colors font-medium inline-flex items-center gap-2 group w-fit">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ver todas as comunidades
          </a>
        </div>

        {/* Cabeçalho da Comunidade */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#401D10] leading-tight mb-2">
            {comunidade.nome}
          </h1>
          {comunidade.padroeiro && (
            <p className="text-xl text-[#A6948D] font-serif italic">Padroeiro(a): {comunidade.padroeiro}</p>
          )}
        </div>

        {/* Imagem Fluida */}
        {comunidade.imagemUrl && (
          <div className="w-full mb-10 rounded-3xl overflow-hidden shadow-sm bg-white/50 border border-[#A6948D]/20 p-2 md:p-3">
            <img 
              src={comunidade.imagemUrl} 
              alt={comunidade.nome} 
              className="w-full h-auto max-h-[450px] md:max-h-[550px] object-cover rounded-2xl mx-auto" 
            />
          </div>
        )}

        {/* Bloco de Informações (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Card: Endereço e Mapa */}
          <div className="bg-white p-8 rounded-3xl border border-[#A6948D]/20 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4 text-[#592C1C]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-serif font-bold text-xl text-[#401D10]">Localização</h3>
            </div>
            <p className="text-[#735A51] mb-6 flex-grow">{comunidade.endereco || 'Endereço não informado.'}</p>
            
            {comunidade.linkMaps && (
              <a href={comunidade.linkMaps} target="_blank" rel="noopener noreferrer" className="w-full inline-flex justify-center items-center gap-2 bg-[#592C1C] hover:bg-[#401D10] text-white font-bold py-3 px-6 rounded-xl transition-colors mt-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Abrir no Google Maps
              </a>
            )}
          </div>

          {/* Card: Horários */}
          <div className="bg-white p-8 rounded-3xl border border-[#A6948D]/20 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4 text-[#592C1C]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-serif font-bold text-xl text-[#401D10]">Horários</h3>
            </div>
            <p className="text-[#735A51] whitespace-pre-wrap">
              {comunidade.horario || 'Consulte a secretaria para saber os horários.'}
            </p>
          </div>
        </div>

        {/* Bloco de História (Opcional) */}
        {comunidade.historia && (
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#A6948D]/20 shadow-sm mb-12">
            <h3 className="font-serif font-bold text-2xl text-[#401D10] mb-6">Nossa História</h3>
            <div className="text-[#735A51] text-lg leading-relaxed space-y-6 font-serif">
              <p className="whitespace-pre-wrap">{comunidade.historia}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}