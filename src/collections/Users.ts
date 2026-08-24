import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Only admins manage the team; everyone else is scoped to their own record.
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    beforeChange: [
      // Bootstrap: the very first user (created via the unguarded "create first user" flow, which
      // bypasses access control) must be an admin, otherwise no one can administer the site. The
      // `roles` default is `editor`, so without this the first account would be editor-only.
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs === 0) {
            return { ...data, roles: ['admin'] }
          }
        }
        return data
      },
    ],
  },
  fields: [
    // Email/password added by Payload auth.
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      // Roles ride in the auth JWT so access checks need no extra DB read. A role change therefore
      // only applies on the user's next login / token refresh.
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only admins may assign or change roles — prevents an editor escalating their own account.
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description:
          'Admin: full control incl. user management and deletes. Editor: create/edit content only.',
      },
    },
  ],
}
