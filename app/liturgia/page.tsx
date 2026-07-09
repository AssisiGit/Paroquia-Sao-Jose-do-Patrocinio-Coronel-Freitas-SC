// app/liturgia/page.tsx
import { client } from '../../lib/sanity'; 
import LiturgiaClient from './LiturgiaClient';

// Força o Next.js a sempre atualizar a página em tempo real. 
// Assim, ao dar meia-noite, a página muda instantaneamente.
export const dynamic = 'force-dynamic';

async function getLiturgiaDoDia(dataStr?: string) {
  try {
    let diaStr, mesStr, anoStr;

    if (dataStr) {
      [anoStr, mesStr, diaStr] = dataStr.split('-');
    } else {
      // Garante que "hoje" seja calculado pelo fuso horário de Brasília (UTC-3)
      const dataAtual = new Date();
      dataAtual.setHours(dataAtual.getHours() - 3);
      anoStr = dataAtual.getFullYear().toString();
      mesStr = String(dataAtual.getMonth() + 1).padStart(2, '0');
      diaStr = String(dataAtual.getDate()).padStart(2, '0');
    }

    const apiUrl = `https://liturgia.up.railway.app/?dia=${diaStr}&mes=${mesStr}&ano=${anoStr}`;
    const res = await fetch(apiUrl, { cache: 'no-store' }); // Garante que a API não seja cacheada
    
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar a liturgia:", error);
    return null;
  }
}

async function getReflexaoDoDia(dataStr?: string) {
  let dataBusca = dataStr;
  
  if (!dataBusca) {
    const dataAtual = new Date();
    dataAtual.setHours(dataAtual.getHours() - 3);
    dataBusca = dataAtual.toISOString().split('T')[0];
  }

  const query = `*[_type == "reflexao" && data == $dataBusca][0] { autor, texto }`;
  
  try {
    return await client.fetch(query, { dataBusca });
  } catch (error) {
    console.error("Erro ao buscar reflexão no Sanity:", error);
    return null;
  }
}

export default async function LiturgiaPage({ searchParams }: { searchParams: any }) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const dataSelecionada = resolvedParams?.data || '';

  const liturgia = await getLiturgiaDoDia(dataSelecionada);
  const reflexao = await getReflexaoDoDia(dataSelecionada);
  
  return <LiturgiaClient liturgia={liturgia} reflexao={reflexao} dataSelecionada={dataSelecionada} />;
}