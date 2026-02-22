import { twiml, say, navGather, redirect } from '$lib/server/twiml.js';
import { getRespondent } from '$lib/server/db.js';
import { getLang, TOTAL_QUESTIONS } from '$lib/server/survey.js';

export async function POST({ request, params }) {
  const n = parseInt(params.n, 10);
  const form = await request.formData();
  const phone = form.get('From');

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);

  return twiml(
    navGather('/voice/navigate', lang.voice, lang.prompts.afterAnswer) +
    redirect('/voice/navigate')
  );
}