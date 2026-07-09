// app/noticias/[slug]/page.tsx
import { client } from '../../../lib/sanity'; 
import NoticiaDetalheClient from './NoticiaDetalheClient';

async function getNoticia(slug: string) {
const query = `*[_type == "noticia" && slug.current == $slug][0] {
    _id,
    titulo,
    resumo,
    dataPublicacao,
    "imagemUrl": imagemPrincipal.asset->url,
    videoUrl,
    "galeriaUrls": galeria[].asset->url
  }`;
  
  try {
    const noticia = await client.fetch(query, { slug });
    return noticia;
  } catch (error) {
    console.error("Erro ao buscar a notícia:", error);
    return null;
  }
}

export default async function NoticiaDetalhe({ params }: { params: any }) {
  // Resolve os parâmetros assíncronos de forma segura para Next.js 15+
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams?.slug;

  const noticia = await getNoticia(slug);

  if (!noticia) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] px-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#401D10] mb-2">Notícia não encontrada</h1>
        <a href="/noticias" className="text-[#592C1C] font-bold hover:underline">
          ← Voltar para a lista de notícias
        </a>
      </div>
    );
  }

  return <NoticiaDetalheClient noticia={noticia} />;
}