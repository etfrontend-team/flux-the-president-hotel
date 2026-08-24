import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import { Button, Container, Heading, Stack } from '@/components/ui'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <Container as="section" className="flex min-h-screen flex-col py-12">
      <Stack align="center" justify="center" gap={12} className="flex-1 text-center">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && <Heading level={1}>Welcome to your new project.</Heading>}
        {user && <Heading level={1}>Welcome back, {user.email}</Heading>}
        <Stack direction="row" gap={4} align="center">
          <Button
            as="a"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </Button>
          <Button
            as="a"
            variant="secondary"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </Button>
        </Stack>
      </Stack>
      <Stack direction="row" gap={2} align="center" justify="center" className="text-sm">
        <p>Update this page by editing</p>
        <a
          className="bg-brand/10 text-brand rounded-card px-2 py-1 font-mono"
          href={fileURL}
        >
          app/(frontend)/page.tsx
        </a>
      </Stack>
    </Container>
  )
}
