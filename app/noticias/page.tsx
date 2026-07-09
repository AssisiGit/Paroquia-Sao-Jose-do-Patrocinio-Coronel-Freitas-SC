// app/noticias/page.tsx
import NoticiasClient from './NoticiasClient';

import { client } from '../../lib/sanity'; 

// Esta função vai ao Sanity e busca as notícias reais
async function getNoticias() {
  const query = `
    *[_type == "noticia"] | order(dataPublicacao desc) {
      _id,
      titulo,
      resumo,
      dataPublicacao,
      "imagemUrl": imagemDestaque.asset->url,
      "slug": slug.current
    }
  `;

  // Tenta buscar no banco de dados
  try {
    const dados = await client.fetch(query);
    return dados;
  } catch (error) {
    console.error("Erro ao buscar notícias do Sanity:", error);
    return []; // Retorna vazio se der erro, assim não quebra o site
  }
}

export default async function NoticiasPage() {
  // Puxa os dados reais (se não tiver nada, retorna array vazio)
  const noticiasSanity = await getNoticias();

  return (
    <main>
      <NoticiasClient noticiasSanity={noticiasSanity} />
    </main>
  );
}