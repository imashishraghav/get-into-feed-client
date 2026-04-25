import { createImageUrlBuilder } from '@sanity/image-url' // ✅ Sahi Tarika

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source) => {
  return builder.image(source)
}
