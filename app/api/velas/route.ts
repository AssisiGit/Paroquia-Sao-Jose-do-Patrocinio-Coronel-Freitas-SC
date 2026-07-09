// app/api/velas/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, intencao } = body;

    if (!nome || !intencao) {
      return NextResponse.json({ error: 'Nome e intenção são obrigatórios' }, { status: 400 });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const token = process.env.SANITY_API_TOKEN;

    // Conectando diretamente à API de "Mutations" (criação de dados) do Sanity
    const sanityUrl = `https://${projectId}.api.sanity.io/v2023-10-01/data/mutate/${dataset}`;

    const response = await fetch(sanityUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            create: {
              _type: 'vela',
              nome: nome,
              intencao: intencao,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao salvar no Sanity');
    }

    return NextResponse.json({ message: 'Vela acesa com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error('Erro na API de velas:', error);
    return NextResponse.json({ error: 'Erro interno ao acender a vela' }, { status: 500 });
  }
}