import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'


export const client = createClient({
  projectId: '6r6351cq', // Cole sua chave aqui, ex: 'abc123xy'
  dataset: 'production',
  apiVersion: '2024-06-25', // A data de hoje
  useCdn: false, // Para que as notícias atualizem na mesma hora em que a secretaria postar
})

// Função auxiliar para extrair a URL das fotos de destaque que a equipe fizer
const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
}