// app/pastorais/page.tsx
import { client } from '../../lib/sanity';
import PastoraisClient from './PastoraisClient';

export const revalidate = 60; 

async function getPastorais() {
  const query = `
    *[_type == "pastoral"] | order(nome asc) {
      _id,
      nome,
      coordenador,
      contato,
      encontros, 
      descricao,
      "imagemUrl": imagem.asset->url
    }
  `;
  
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Erro ao buscar pastorais:", error);
    return [];
  }
}

export default async function PastoraisPage() {
  const pastorais = await getPastorais();
  return <PastoraisClient pastorais={pastorais} />;
}