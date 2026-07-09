// app/noticias/[slug]/NoticiaDetalheClient.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface Noticia {
  _id: string;
  titulo: string;
  resumo: string;
  dataPublicacao: string;
  imagemUrl?: string;
  videoUrl?: string;
  galeriaUrls?: string[];
}

export default function NoticiaDetalheClient({ noticia }: { noticia: Noticia }) {
  // =========================================
  // ESTADOS DO LIGHTBOX (Galeria Pop-up)
  // =========================================
  const [lightboxAberto, setLightboxAberto] = useState(false);
  const [indiceMedia, setIndiceMedia] = useState(0);

  // Extrai o ID do YouTube
  const videoId = useMemo(() => {
    if (!noticia.videoUrl) return null;
    const match = noticia.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  }, [noticia.videoUrl]);

  // Junta TODAS as mídias (Imagem principal + Vídeo + Galeria) em uma lista só
  const midias = useMemo(() => {
    const itens: { tipo: 'imagem' | 'video'; url: string }[] = [];
    if (noticia.imagemUrl) {
      itens.push({ tipo: 'imagem', url: noticia.imagemUrl });
    }
    if (videoId) {
      itens.push({ tipo: 'video', url: videoId });
    }
    if (noticia.galeriaUrls) {
      noticia.galeriaUrls.forEach(url => itens.push({ tipo: 'imagem', url }));
    }
    return itens;
  }, [noticia, videoId]);

  // Calcula onde as fotos extras começam na lista unificada
  const offsetGaleria = (noticia.imagemUrl ? 1 : 0) + (videoId ? 1 : 0);

  const abrirLightbox = (index: number) => {
    setIndiceMedia(index);
    setLightboxAberto(true);
  };

  const proximaMedia = () => {
    setIndiceMedia((prev) => (prev + 1) % midias.length);
  };

  const mediaAnterior = () => {
    setIndiceMedia((prev) => (prev - 1 + midias.length) % midias.length);
  };

  // Permite usar as setas do teclado e o Esc para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxAberto) return;
      if (e.key === 'Escape') setLightboxAberto(false);
      if (e.key === 'ArrowRight') proximaMedia();
      if (e.key === 'ArrowLeft') mediaAnterior();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxAberto, midias.length]);

  return (
    <div className="relative min-h-screen pb-20 font-sans bg-[#F2F2F2] flex flex-col">
      
      {/* =========================================
          CONTEÚDO DA NOTÍCIA
      ========================================= */}
      <div className="max-w-md md:max-w-3xl mx-auto pt-8 md:pt-12 px-6 w-full flex-1">
        
        {/* TOPO MOBILE (Botão Voltar) */}
        <div className="md:hidden flex justify-between items-start mb-8 relative z-30">
          <a href="/noticias" className="text-[#735A51] hover:text-[#401D10] transition-colors font-medium flex items-center gap-1.5 bg-[#A6948D]/10 px-4 py-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </a>
        </div>

        {/* Link de voltar no Desktop */}
        <div className="hidden md:block mb-8">
          <a href="/noticias" className="text-[#735A51] hover:text-[#401D10] transition-colors font-medium inline-flex items-center gap-2 group w-fit">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a lista de notícias
          </a>
        </div>

        {/* Data de Publicação */}
        <time className="text-[#A6948D] font-bold text-sm uppercase tracking-widest mb-3 block">
          {format(new Date(noticia.dataPublicacao), "dd 'de' MMMM, yyyy", { locale: ptBR })}
        </time>
        
        {/* Título Principal */}
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#401D10] leading-tight mb-8">
          {noticia.titulo}
        </h1>

        {/* Imagem de Destaque Principal (Agora é clicável) */}
        {noticia.imagemUrl && (
          <div 
            onClick={() => abrirLightbox(0)}
            className="w-full mb-10 rounded-3xl overflow-hidden shadow-sm bg-white/50 border border-[#A6948D]/20 p-2 md:p-3 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={noticia.imagemUrl} 
                alt={noticia.titulo} 
                className="w-full h-auto max-h-[450px] md:max-h-[550px] object-cover mx-auto transition-transform duration-500 group-hover:scale-[1.02]" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </div>
            </div>
          </div>
        )}

        {/* Corpo do Texto */}
        <div className="text-[#735A51] text-lg leading-relaxed space-y-6 font-serif mb-12">
          <p className="whitespace-pre-wrap">{noticia.resumo}</p> 
        </div>

        {/* =========================================
            SESSÃO DO VÍDEO
        ========================================= */}
        {videoId && (
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-[#401D10] mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#A6948D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Vídeo
            </h3>
            <div className="relative w-full pb-[56.25%] h-0 rounded-3xl overflow-hidden shadow-sm border border-[#A6948D]/20 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-3xl"
              ></iframe>
            </div>
          </div>
        )}

        {/* =========================================
            GALERIA DE FOTOS (Agora é clicável)
        ========================================= */}
        {noticia.galeriaUrls && noticia.galeriaUrls.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-[#401D10] mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#A6948D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Galeria de Fotos
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {noticia.galeriaUrls.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => abrirLightbox(index + offsetGaleria)}
                  className="aspect-square bg-[#A6948D]/10 rounded-2xl overflow-hidden border border-[#A6948D]/20 group cursor-pointer relative"
                >
                  <img 
                    src={url} 
                    alt={`Galeria ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =========================================
          MODAL DO LIGHTBOX (Galeria Tela Cheia)
      ========================================= */}
      {lightboxAberto && midias.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
          
          {/* Botão Fechar */}
          <button 
            onClick={() => setLightboxAberto(false)} 
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/20 rounded-full"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Seta Esquerda */}
          {midias.length > 1 && (
            <button 
              onClick={mediaAnterior} 
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-50 p-3 bg-black/20 rounded-full hover:bg-black/40"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          {/* Mídia Central */}
          <div className="w-full max-w-6xl max-h-[85vh] px-20 md:px-32 flex items-center justify-center relative select-none">
            {midias[indiceMedia].tipo === 'imagem' ? (
              <img 
                src={midias[indiceMedia].url} 
                alt="Galeria Expandida" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              />
            ) : (
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-white/10">
                <iframe
                  src={`https://www.youtube.com/embed/${midias[indiceMedia].url}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
          </div>

          {/* Seta Direita */}
          {midias.length > 1 && (
            <button 
              onClick={proximaMedia} 
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-50 p-3 bg-black/20 rounded-full hover:bg-black/40"
            >
               <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}

          {/* Indicador de Páginas */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-medium tracking-widest text-sm bg-black/40 px-5 py-2 rounded-full border border-white/10">
            {indiceMedia + 1} / {midias.length}
          </div>

        </div>
      )}

    </div>
  );
}