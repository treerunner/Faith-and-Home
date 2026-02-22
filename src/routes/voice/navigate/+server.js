import { twiml, say, navGather, redirect, hangup } from '$lib/server/twiml.js';
import { getRespondent, getAnswered, markCompleted, getFullRespondent } from '$lib/server/db.js';
import { getLang, getNextUnanswered, TOTAL_QUESTIONS } from '$lib/server/survey.js';
import { sendCompletionEmail } from '$lib/server/email.js';

export async function POST({ request, url }) {
  const form = await request.formData();
  const phone = form.get('From');
  const digits = (form.get('Digits') ?? '').trim();

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);
  const answered = await getAnswered(respondent.id);

  // If coming from answer/[n], that question isn't saved yet — include it
  const justAnswered = parseInt(url.searchParams.get('just') ?? '', 10);
  const answeredFull = !isNaN(justAnswered)
    ? [...new Set([...answered, justAnswered])]
    : answered;

  let target;

  if (digits === '' || digits === '#') {
    // Default — next unanswered question
    target = getNextUnanswered(answeredFull);
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

  // All questions answered (based on answeredFull so last question is counted)
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