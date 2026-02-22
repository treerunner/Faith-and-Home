import { twiml, say, navGather, redirect } from '$lib/server/twiml.js';
import { getRespondent } from '$lib/server/db.js';
import { getLang } from '$lib/server/survey.js';

export async function POST({ request, url }) {
  const form = await request.formData();
  const phone = form.get('From');

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);

  return twiml(
    say(lang.prompts.navigationFirst, lang.voice) +
    navGather('/voice/navigate', lang.voice, lang.prompts.navigationFirst) +
    redirect('/voice/navigate')
  );
}