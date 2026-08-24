import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)

  // Backfill: `roles` is required, but a hasMany select adds no NOT-NULL column to `users`, so the
  // table create above leaves any existing user with zero roles — i.e. locked out of everything.
  // Grant every pre-existing user the `admin` role so the current bootstrap admin (and anyone
  // already in a clone's local / staging / prod D1) keeps full access. `id` is an INTEGER PRIMARY
  // KEY, so SQLite auto-assigns it. New users created after this migration get their roles from the
  // collection (default `editor`, first user promoted to `admin`).
  await db.run(sql`
    INSERT INTO \`users_roles\` (\`order\`, \`parent_id\`, \`value\`)
    SELECT 1, \`id\`, 'admin' FROM \`users\`
    WHERE \`id\` NOT IN (SELECT \`parent_id\` FROM \`users_roles\`);
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_roles\`;`)
}
