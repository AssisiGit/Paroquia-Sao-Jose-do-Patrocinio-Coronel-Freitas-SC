import createImageUrlBuilder from '@sanity/image-url'
import { client } from '../lib/sanity'

const builder = createImageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)