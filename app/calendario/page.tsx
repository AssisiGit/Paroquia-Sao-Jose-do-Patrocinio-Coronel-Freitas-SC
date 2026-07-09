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

  return (
    <main className="min-h-screen bg-[#F4F2EE]">
      <CalendarioClient eventosSanity={eventos} />
    </main>
  );
}