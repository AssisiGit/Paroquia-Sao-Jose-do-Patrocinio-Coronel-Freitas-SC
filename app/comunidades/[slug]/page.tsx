// app/comunidades/[slug]/page.tsx
import { client } from '../../../lib/sanity'; // ⚠️ Ajuste o caminho se necessário
import ComunidadeDetalheClient from './ComunidadeDetalheClient';

async function getComunidade(slug: string) {
  const query = `
    *[_type == "comunidade" && slug.current == $slug][0] {
      _id,
      nome,
      padroeiro,
      "imagemUrl": imagemPrincipal.asset->url,
      endereco,
      linkMaps,
      horario,
      historia
    }
  `;
  
  try {
    const comunidade = await client.fetch(query, { slug });
    return comunidade;
  } catch (error) {
    console.error("Erro ao buscar a comunidade:", error);
    return null;
  }
}

export default async function ComunidadeDetalhe({ params }: { params: any }) {
  // Resolve os parâmetros assíncronos (Next.js 15+)
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams?.slug;

  const comunidade = await getComunidade(slug);

  if (!comunidade) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F2] px-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#401D10] mb-2">Comunidade não encontrada</h1>
        <a href="/comunidades" className="text-[#592C1C] font-bold hover:underline">
          ← Voltar para a lista de comunidades
        </a>
      </div>
    );
  }

  return <ComunidadeDetalheClient comunidade={comunidade} />;
}