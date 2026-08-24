import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Media must stay publicly readable — images render on the public site.
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // `crop` needs sharp to generate cropped files, which is unavailable on Workers.
    crop: false,
    // `focalPoint` only stores x/y coordinates — no sharp required. Apply them on the
    // front-end via CSS object-position (see src/lib/image.ts). Do NOT add `imageSizes`
    // here: generating resized files needs sharp and will fail on Workers.
    focalPoint: true,
  },
}
