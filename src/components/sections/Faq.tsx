'use client'

import { useState } from 'react'

import { MinusIcon, PlusIcon } from '@/components/icons'
import { Container, Heading, Prose, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

type FaqItem = {
  question: string
  answer: string[]
}

const FAQS: FaqItem[] = [
  {
    question: 'Question 01',
    answer: [
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci. Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
    ],
  },
  {
    question: 'Question 02',
    answer: [
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci. Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
    ],
  },
  {
    question: 'Question 03',
    answer: [
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci. Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
    ],
  },
  {
    question: 'Question 04',
    answer: [
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci. Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
      'Lorem ipsum dolor sit amet consectetur. Ullamcorper quam pellentesque porttitor nisi quis bibendum tristique consequat orci.',
    ],
  },
]

/**
 * Per Figma (node 1:751): accordion — the first question is open by default,
 * and per the annotation, only one item can be open at a time (opening one
 * closes whichever was open; clicking the open item closes it).
 */
export function Faq({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  return (
    <section className={cn('general-padding', className)}>
      <Container className="max-w-1095 mx-auto 1199:px-0">
        <Heading level={3} className="mb-60 max-992:mb-40 text-center max-992:text-pretty">
          Frequently Asked Questions
        </Heading>

        <div className="border-t border-brand-muted/30">
          {FAQS.map((faq, index) => {
            const isOpen = activeIndex === index

            return (
              <div key={faq.question} className="border-b border-brand-muted/30">
                <div
                  className={cn(
                    'cursor-pointer px-20 py-30 my-8 transition-colors duration-300',
                    !isOpen && 'hover:bg-accent/10',
                  )}
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <button
                    type="button"
                    className={cn('flex w-full cursor-pointer items-center justify-between gap-20 text-left transition-all duration-300', isOpen && 'mb-42')}
                  >
                    <Heading level={4} color="brand" uppercase={false} className="capitalize max-w-961">
                      {faq.question}
                    </Heading>
                    {isOpen ? (
                      <MinusIcon className="h-7 w-7 shrink-0 text-brand" />
                    ) : (
                      <PlusIcon className="h-7 w-7 shrink-0 text-brand" />
                    )}
                  </button>

                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <Stack gap={20} tabletGap={20} mobileGap={20} className="max-w-961 pb-30">
                        {faq.answer.map((paragraph, i) => (
                          <Prose key={i} color="ink-light" className="text-14 max-w-full">
                            {paragraph}
                          </Prose>
                        ))}
                      </Stack>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
