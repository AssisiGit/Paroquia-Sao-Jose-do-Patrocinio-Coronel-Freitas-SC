// app/comunidades/page.tsx
import { client } from '../../lib/sanity'; 
import ComunidadesClient from './Comunidades.Client';

export const revalidate = 60; // Atualiza a página a cada 60 segundos se houver mudanças

async function getComunidades() {
  // Busca todas as comunidades e ordena por ordem alfabética (nome asc)
  const query = `
    *[_type == "comunidade"] | order(nome asc) {
      _id,
      nome,
      "slug": slug.current,
      padroeiro,
      "imagemUrl": imagemPrincipal.asset->url,
      endereco,
      horariosMissa
    }
  `;
  
  try {
    const comunidades = await client.fetch(query);
    return comunidades;
  } catch (error) {
    console.error("Erro ao buscar comunidades:", error);
    return [];
  }
}

export default async function ComunidadesPage() {
  const comunidades = await getComunidades();
  return <ComunidadesClient comunidadesSanity={comunidades} />;
}