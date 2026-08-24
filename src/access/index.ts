import type { Access, FieldAccess } from 'payload'

import type { User } from '../payload-types'

/**
 * Role-based access control for the boilerplate.
 *
 * Users carry a `roles` array (`admin` | `editor`, see src/collections/Users.ts). Roles are stored
 * in the auth JWT (`saveToJWT: true`), so `req.user.roles` is populated on every request without an
 * extra DB read. Note: a role change only takes effect on the user's next login / token refresh.
 *
 * These helpers are intentionally tiny and pure so they can be shared across first-party collections
 * (Users, Pages, Media) and the plugin collections wired up in payload.config.ts.
 */
const hasRole = (user: User | null, role: NonNullable<User['roles']>[number]): boolean =>
  Boolean(user?.roles?.includes(role))

/** Full control — Flux team. Manages users, settings, and is the only role that may delete. */
export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

/** Content access — admins and client-side editors. Create/update content collections. */
export const isAdminOrEditor: Access = ({ req: { user } }) =>
  hasRole(user, 'admin') || hasRole(user, 'editor')

/** Admins see/operate on all users; everyone else is scoped to their own record. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin')) return true
  if (user) return { id: { equals: user.id } }
  return false
}

/**
 * Field-level guard for `users.roles`: only admins may set or change roles. Without this an editor
 * (who may update their own record via `isAdminOrSelf`) could escalate themselves to admin.
 */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

/** Public — used where a collection must stay open (e.g. public form submissions, media reads). */
export const anyone: Access = () => true
