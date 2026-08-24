import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260603_161049_add_payload_kv from './20260603_161049_add_payload_kv';
import * as migration_20260604_170128_add_plugins_seo_forms_redirects_drafts from './20260604_170128_add_plugins_seo_forms_redirects_drafts';
import * as migration_20260605_102821_add_importexport_and_redirect_types from './20260605_102821_add_importexport_and_redirect_types';
import * as migration_20260609_121223_add_user_roles from './20260609_121223_add_user_roles';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260603_161049_add_payload_kv.up,
    down: migration_20260603_161049_add_payload_kv.down,
    name: '20260603_161049_add_payload_kv',
  },
  {
    up: migration_20260604_170128_add_plugins_seo_forms_redirects_drafts.up,
    down: migration_20260604_170128_add_plugins_seo_forms_redirects_drafts.down,
    name: '20260604_170128_add_plugins_seo_forms_redirects_drafts',
  },
  {
    up: migration_20260605_102821_add_importexport_and_redirect_types.up,
    down: migration_20260605_102821_add_importexport_and_redirect_types.down,
    name: '20260605_102821_add_importexport_and_redirect_types'
  },
  {
    up: migration_20260609_121223_add_user_roles.up,
    down: migration_20260609_121223_add_user_roles.down,
    name: '20260609_121223_add_user_roles'
  },
];
