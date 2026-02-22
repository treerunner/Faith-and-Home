import { twiml, say, navGather, redirect, hangup } from '$lib/server/twiml.js';
import { getRespondent, getAnswered, markCompleted, getFullRespondent } from '$lib/server/db.js';
import { getLang, getNextUnanswered, TOTAL_QUESTIONS } from '$lib/server/survey.js';
import { sendCompletionEmail } from '$lib/server/email.js';

export async function POST({ request }) {
  const form = await request.formData();
  const phone = form.get('From');
  const digits = (form.get('Digits') ?? '').trim();

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);
  const answered = await getAnswered(respondent.id);

  let target;

  if (digits === '' || digits === '#') {
    // Default — next unanswered question
    target = getNextUnanswered(answered);
  } else {
    const num = parseInt(digits, 10);
    if (isNaN(num) || num < 1 || num > TOTAL_QUESTIONS) {
      return twiml(
        navGather('/voice/navigate', lang.voice, lang.prompts.invalidQuestion) +
        redirect('/voice/navigate')
      );
    }
    target = num;
  }

  // All questions answered
  if (!target) {
    if (!respondent.completed_at) {
      await markCompleted(phone);
      try {
        const full = await getFullRespondent(phone);
        await sendCompletionEmail(full, lang);
      } catch (err) {
        console.error('Failed to send completion email:', err);
      }
    }
    return twiml(
      say(lang.prompts.allDone, lang.voice) +
      hangup()
    );
  }

  return twiml(redirect(`/voice/question/${target}`));
}