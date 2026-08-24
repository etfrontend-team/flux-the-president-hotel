import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

// Regression coverage for the roles/permissions (RBAC) layer in src/access. Exercises the
// first-user bootstrap hook and access enforcement via the Local API with `overrideAccess: false`
// + a `user` context (which is how REST/GraphQL evaluate access).
let payload: Payload
let admin: any
let editor: any

describe('RBAC', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    // Clean slate so the first-user bootstrap can be asserted deterministically.
    await payload.delete({ collection: 'users', where: {} })

    // First user created with NO roles → bootstrap hook must promote to admin. `roles` is required
    // on the type, so cast: omitting it at runtime is exactly what this test exercises.
    admin = await payload.create({
      collection: 'users',
      data: { email: 'admin@test.dev', password: 'test12345' } as never,
    })
    // Subsequent user explicitly an editor.
    editor = await payload.create({
      collection: 'users',
      data: { email: 'editor@test.dev', password: 'test12345', roles: ['editor'] },
    })
  })

  it('promotes the first user to admin', () => {
    expect(admin.roles).toEqual(['admin'])
  })

  it('editor cannot delete a page; admin can', async () => {
    const page = await payload.create({
      collection: 'pages',
      data: { title: 'Temp', slug: 'temp-rbac', _status: 'published' },
    })

    await expect(
      payload.delete({ collection: 'pages', id: page.id, overrideAccess: false, user: editor }),
    ).rejects.toThrow()

    const deleted = await payload.delete({
      collection: 'pages',
      id: page.id,
      overrideAccess: false,
      user: admin,
    })
    expect(deleted.id).toBe(page.id)
  })

  it('editor sees only their own user record', async () => {
    const res = await payload.find({
      collection: 'users',
      overrideAccess: false,
      user: editor,
    })
    expect(res.docs.map((d) => d.email)).toEqual(['editor@test.dev'])
  })

  it('editor cannot create another user', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: { email: 'x@test.dev', password: 'test12345', roles: ['editor'] },
        overrideAccess: false,
        user: editor,
      }),
    ).rejects.toThrow()
  })
})
