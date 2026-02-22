import { twiml, say, digitGather, navGather, redirect } from '$lib/server/twiml.js';
import { getRespondent, upsertRespondent } from '$lib/server/db.js';
import { getLang, getNextUnanswered } from '$lib/server/survey.js';
import { getAnswered } from '$lib/server/db.js';

export async function POST({ request }) {
  const form = await request.formData();
  const phone = form.get('From');

  const respondent = await getRespondent(phone);

  // --- NEW CALLER ---
  if (!respondent) {
    await upsertRespondent(phone);
    const lang = getLang('en');
    return twiml(
      digitGather('/voice/language', lang.voice, lang.prompts.languageSelect) +
      redirect('/voice/language') // fallback if no input
    );
  }

  // --- RETURNING CALLER ---
  const lang = getLang(respondent.language);
  const answered = await getAnswered(respondent.id);
  const welcomeBack = lang.prompts.welcomeBack(answered);

  return twiml(
    say(welcomeBack, lang.voice) +
    navGather('/voice/navigate', lang.voice, lang.prompts.returningNavigation) +
    redirect('/voice/navigate')
  );
}