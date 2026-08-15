import { client } from '../../lib/sanity';
import CalendarioClient from './CalendarioClient';

export const dynamic = 'force-dynamic'; 

export default async function CalendarioPage() {
  const query = `*[_type == "evento"] | order(dataInicio asc) {
    _id,
    titulo,
    tipo,
    dataInicio,
    local,
    freiCelebrante,
    exigeInscricao
  }`;

  const eventos = await client.fetch(query);

// Função mágica para resolver o bug de fuso horário
const formatarHorario = (dataString: string) => {
  if (!dataString) return '';
  
  const data = new Date(dataString);
  
  // Força a formatação no padrão brasileiro e no fuso de São Paulo/Brasília
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo' // 👈 O segredo está aqui!
  }).format(data);
};

  return (
    <main className="min-h-screen bg-[#F4F2EE]">
      <CalendarioClient eventosSanity={eventos} />
    </main>
  );
}