import { BookYourStay } from '@/components/sections/BookYourStay'
import { Subscribe } from '@/components/sections/Subscribe'
import { EventShowcase } from '@/components/sections/EventShowcase'
import { UpcomingEvents } from '@/components/sections/UpcomingEvents'
import { ArticleConclusion } from '@/components/sections/ArticleConclusion'
import { Faq } from '@/components/sections/Faq'

export default function MediaHubPage() {
  return (
    <>
        <Faq/>
        <ArticleConclusion/>
        <EventShowcase />
        <UpcomingEvents />
        <BookYourStay />
        <Subscribe />
    </>
  )
}