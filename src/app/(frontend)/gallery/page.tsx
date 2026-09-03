import { Hero } from '@/components/sections/Hero'
import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { ImageGallery } from '@/components/sections/ImageGallery'

export default function GalleryPage() {
  return (
    <>
      <Hero
        eyebrow="Gallery"
        heading={
          <>
            <span className="block">The President in Pictures</span>
          </>
        }
      />
      <ImageGallery/>
      <BookYourStay />
      <Subscribe />
    </>
  )
}