// app/velas/page.tsx
import { client } from '../../lib/sanity';
import VelasClient from './VelasClient';

export const revalidate = 60; // Atualiza a página a cada 1 minuto

async function getVelas() {
  // Calcula exatamente o momento de 9 dias atrás
  const noveDiasAtras = new Date();
  noveDiasAtras.setDate(noveDiasAtras.getDate() - 9);
  const dataLimite = noveDiasAtras.toISOString();

  // O Sanity vai buscar apenas as velas criadas APÓS essa data limite
  const query = `*[_type == "vela" && _createdAt > $dataLimite] | order(_createdAt desc) {
    _id,
    nome,
    intencao,
    _createdAt
  }`;
  
  try {
    return await client.fetch(query, { dataLimite });
  } catch (error) {
    console.error("Erro ao buscar velas:", error);
    return [];
  }
}

export default async function VelasPage() {
  const velas = await getVelas();
  return <VelasClient velasIniciais={velas} />;
}