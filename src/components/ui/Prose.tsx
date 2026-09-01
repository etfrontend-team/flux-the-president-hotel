import React from 'react'

import { cn } from '@/lib/utils'

type ProseColor = 'brand' | 'brand-light' | 'ink' | 'ink-light' | 'paper' | 'white'
type ProseFont = 'body' | 'accent' | 'display'
type ProseTag = 'div' | 'span' | 'p'

interface ProseProps {
  as?: ProseTag
  color?: ProseColor
  font?: ProseFont
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode | React.ReactNode[]
}

const colors: Record<ProseColor, string> = {
  brand: 'text-brand prose-headings:text-brand prose-a:text-brand',
  'brand-light': 'text-brand/80 prose-headings:text-brand/80 prose-a:text-brand/80 max-w-full',
  ink: 'text-ink prose-headings:text-ink prose-a:text-ink',
  'ink-light': 'text-ink/80 prose-headings:text-ink/80 prose-a:text-ink/80',
  paper: 'text-paper prose-headings:text-paper prose-a:text-paper',
  white: 'text-white prose-headings:text-white prose-a:text-white',
}

const fonts: Record<ProseFont, string> = {
  body: 'font-body',
  accent: 'font-accent',
  display: 'font-display',
}

/**
 * Wraps long-form, CMS-driven content (Payload Lexical rich text) so
 * headings, paragraphs, lists, links and images are auto-styled by the
 * Tailwind typography plugin.
 *
 * Pair with Payload's Lexical renderer, e.g.:
 *
 *   import { RichText } from '@payloadcms/richtext-lexical/react'
 *   <Prose><RichText data={post.content} /></Prose>
 */
export function Prose({ as = 'div', color = 'ink', font = 'body', className, style, children }: ProseProps) {
  const Tag = as
  return (
    <Tag
      style={style}
      className={cn('prose text-15 leading-muted font-light tracking-5', fonts[font], colors[color], className)}
    >
      {Array.isArray(children) ? (
        children.map((child, i) => <p key={i}>{child}</p>)
      ) : (
        <>{children}</>
      )}
    </Tag>
  )
}
