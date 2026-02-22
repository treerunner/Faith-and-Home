import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export { sql };

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS respondents (
      id          SERIAL PRIMARY KEY,
      phone       TEXT UNIQUE NOT NULL,
      language    TEXT NOT NULL DEFAULT 'en',
      intro_url   TEXT,
      completed_at TIMESTAMP,
      created_at  TIMESTAMP DEFAULT NOW(),
      updated_at  TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS responses (
      id           SERIAL PRIMARY KEY,
      respondent_id INT REFERENCES respondents(id) ON DELETE CASCADE,
      question_num INT NOT NULL,
      recording_url TEXT,
      duration_sec  INT,
      created_at   TIMESTAMP DEFAULT NOW(),
      UNIQUE(respondent_id, question_num)
    )
  `;
}

export async function getRespondent(phone) {
  const rows = await sql`SELECT * FROM respondents WHERE phone = ${phone}`;
  return rows[0] ?? null;
}

export async function upsertRespondent(phone, language = 'en') {
  const rows = await sql`
    INSERT INTO respondents (phone, language)
    VALUES (${phone}, ${language})
    ON CONFLICT (phone) DO UPDATE SET updated_at = NOW()
    RETURNING *
  `;
  return rows[0];
}

export async function setLanguage(phone, language) {
  await sql`
    UPDATE respondents SET language = ${language}, updated_at = NOW()
    WHERE phone = ${phone}
  `;
}

export async function setIntroUrl(phone, url) {
  await sql`
    UPDATE respondents SET intro_url = ${url}, updated_at = NOW()
    WHERE phone = ${phone}
  `;
}

export async function saveResponse(respondentId, questionNum, recordingUrl, durationSec) {
  await sql`
    INSERT INTO responses (respondent_id, question_num, recording_url, duration_sec)
    VALUES (${respondentId}, ${questionNum}, ${recordingUrl}, ${durationSec})
    ON CONFLICT (respondent_id, question_num)
    DO UPDATE SET recording_url = ${recordingUrl}, duration_sec = ${durationSec}, created_at = NOW()
  `;
}

export async function getAnswered(respondentId) {
  const rows = await sql`
    SELECT question_num FROM responses
    WHERE respondent_id = ${respondentId}
    ORDER BY question_num
  `;
  return rows.map(r => r.question_num);
}

export async function markCompleted(phone) {
  await sql`
    UPDATE respondents SET completed_at = NOW(), updated_at = NOW()
    WHERE phone = ${phone}
  `;
}

export async function getFullRespondent(phone) {
  const respondent = await getRespondent(phone);
  if (!respondent) return null;
  const responses = await sql`
    SELECT * FROM responses
    WHERE respondent_id = ${respondent.id}
    ORDER BY question_num
  `;
  return { ...respondent, responses };
}