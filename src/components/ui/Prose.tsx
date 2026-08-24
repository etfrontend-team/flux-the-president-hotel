import React from 'react'

import { cn } from '@/lib/utils'

type ProseProps = {
  className?: string
  children: React.ReactNode
}

/**
 * Wraps long-form, CMS-driven content (Payload Lexical rich text) so headings,
 * paragraphs, lists, links and images are auto-styled by the Tailwind
 * typography plugin.
 *
 * Pair with Payload's Lexical renderer, e.g.:
 *
 *   import { RichText } from '@payloadcms/richtext-lexical/react'
 *   <Prose><RichText data={post.content} /></Prose>
 */
export function Prose({ className, children }: ProseProps) {
  return (
    <div
      className={cn(
        'prose prose-lg prose-headings:font-display prose-headings:text-ink prose-a:text-brand max-w-none',
        className,
      )}
    >
      {children}
    </div>
  )
}
