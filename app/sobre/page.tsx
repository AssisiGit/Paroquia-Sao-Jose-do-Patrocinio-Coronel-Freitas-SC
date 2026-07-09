// app/sobre/page.tsx
import { client } from '../../lib/sanity'; // Ajuste o caminho se necessário
import SobreClient from './SobreClient';

export const revalidate = 60; 

async function getDadosSobre() {
  const query = `
    *[_type == "sobre"][0] {
      titulo,
      "imagemUrl": fotoMatriz.asset->url,
      historia,
      horarioSecretaria,
      telefone,
      whatsapp,
      endereco,
      fraternidade[] {
        nome,
        funcao,
        "fotoUrl": foto.asset->url,
        historia
      }
    }
  `;
  
  try {
    const dados = await client.fetch(query);
    return dados;
  } catch (error) {
    console.error("Erro ao buscar dados da página Sobre:", error);
    return null;
  }
}

export default async function SobrePage() {
  const dados = await getDadosSobre();
  return <SobreClient dados={dados} />;
}