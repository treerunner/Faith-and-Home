import { twiml, say, record } from '$lib/server/twiml.js';
import { setLanguage } from '$lib/server/db.js';
import { getLang } from '$lib/server/survey.js';

export async function POST({ request, url }) {
  const form = await request.formData();
  const phone = form.get('From');
  const digits = form.get('Digits') ?? '';

  const language = digits.trim() === '1' ? 'es' : 'en';
  await setLanguage(phone, language);

  const lang = getLang(language);

  const encodedPhone = encodeURIComponent(phone);
  const statusCallbackUrl = `${url.origin}/voice/recording-ready/intro?phone=${encodedPhone}`;

  return twiml(
    say(lang.prompts.welcome, lang.voice) +
    say(lang.prompts.nameChurch, lang.voice) +
    record('/voice/after-intro', statusCallbackUrl, 120)
  );
}