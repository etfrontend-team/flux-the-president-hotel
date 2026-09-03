'use client'

import { useState } from 'react'

import { FacebookAltIcon, InstagramAltIcon, LinkIcon } from '@/components/icons'
import { Button, Container, Heading, Prose } from '@/components/ui'

const TAGS = ['tag1', 'tag2', 'tag3']

const META = {
  category: '[Category Name]',
  published: '[DD Month YYYY]',
  updated: '[DD Month YYYY]',
  readingTime: '[X]',
}

export function ArticleConclusion() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="general-padding">
      <Container variant="lg" className="">
        <div className="px-11 992:px-38">
        <Heading level={3} className="mb-35 inline-block">
          Conclusion & Next Steps
        </Heading>

        <div className="flex flex-col gap-20">
          <Prose color="ink-light" className="text-14 max-w-none">
            [Closing paragraph — 2 to 3 sentences] Lorem ipsum dolor sit amet consectetur. Nibh
            pellentesque aliquet dis enim cursus mi id ultricies nunc. Facilisis proin quam nec
            mattis et id habitasse semper sed.
          </Prose>
          <Prose color="ink-light" className="text-14 max-w-none">
            Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi
            quis bibendum tristique consequat orci. Lorem ipsum dolor sit amet consectetur.
            Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.
          </Prose>
        </div>

        <p className="mt-50 mb-57 text-13 text-ink/60">
          Tags: {TAGS.map((tag) => `[${tag}]`).join(' | ')} | Category: {META.category} |
          Originally published: {META.published} | Last updated: {META.updated} | Reading time:{' '}
          {META.readingTime} minutes
        </p>

        <div className="mb-50 992:mb-57 flex flex-wrap items-center gap-12">
          <span className="text-16 tracking-1.6 uppercase text-brand">Share this article :</span>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex cursor-pointer items-center gap-8 font-body text-14 tracking-0.7 uppercase text-brand"
          >
            <LinkIcon className="h-14 w-14" />
            {copied ? 'Copied' : 'Copy link'}
          </button>

          <a
            href="#"
            aria-label="Share on Instagram"
            className="flex h-25 w-25 items-center justify-center rounded-full text-brand"
          >
            <InstagramAltIcon className="h-16 w-16" />
          </a>
          <a
            href="#"
            aria-label="Share on Facebook"
            className="flex h-25 w-25 items-center justify-center rounded-full text-brand"
          >
            <FacebookAltIcon className="h-15 w-15" />
          </a>
        </div>

        <Button as="a" href="#" variant="outlined" color="brand">
          Back to Articles
        </Button>
        </div>
      </Container>
    </section>
  )
}
