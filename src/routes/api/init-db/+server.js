import { initDb, migrateDb } from '$lib/server/db.js';

const SECRET = process.env.INIT_SECRET ?? 'change-me';

export async function GET({ url }) {
  if (url.searchParams.get('secret') !== SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  await initDb();
  await migrateDb();
  return new Response('Database initialized', { status: 200 });
}
