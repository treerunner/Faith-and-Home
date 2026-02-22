import { twiml, say, record, redirect } from '$lib/server/twiml.js';
import { getRespondent } from '$lib/server/db.js';
import { getLang, TOTAL_QUESTIONS } from '$lib/server/survey.js';

export async function POST({ request, params }) {
  const n = parseInt(params.n, 10);
  const form = await request.formData();
  const phone = form.get('From');

  if (isNaN(n) || n < 1 || n > TOTAL_QUESTIONS) {
    return twiml(redirect('/voice/navigate'));
  }

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);
  const question = lang.questions.find(q => q.number === n);

  return twiml(
    say(question.text, lang.voice) +
    say(lang.prompts.recordingInstruction, lang.voice) +
    record(`/voice/answer/${n}`)
  );
}