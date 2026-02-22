import { twiml, say, record, redirect } from '$lib/server/twiml.js';
import { getRespondent, setLanguage } from '$lib/server/db.js';
import { getLang } from '$lib/server/survey.js';

export async function POST({ request }) {
  const form = await request.formData();
  const phone = form.get('From');
  const digits = form.get('Digits') ?? '';

  const language = digits.trim() === '1' ? 'es' : 'en';
  await setLanguage(phone, language);

  const respondent = await getRespondent(phone);
  const lang = getLang(language);

  return twiml(
    say(lang.prompts.welcome, lang.voice) +
    say(lang.prompts.nameChurch, lang.voice) +
    record('/voice/after-intro', 120)
  );
}