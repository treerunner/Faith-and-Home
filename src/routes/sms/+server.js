import { sms, smsEmpty } from '$lib/server/twiml.js';
import {
  getRespondent,
  upsertRespondent,
  setLanguage,
  setSmsState,
  setIntroText,
  setSmsOptedIn,
  setSmsOptedOut,
  getAnswered,
  saveTextResponse,
  markCompleted,
  getFullRespondent,
} from '$lib/server/db.js';
import { getLang, TOTAL_QUESTIONS, getNextUnanswered } from '$lib/server/survey.js';
import { sendCompletionEmail } from '$lib/server/email.js';

// Keywords Twilio may still forward to the webhook even after auto-handling
const STOP_KEYWORDS = new Set(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT']);
const OPTIN_KEYWORDS = new Set(['YES', 'SÍ', 'SI', 'START', 'UNSTOP']);
const HELP_KEYWORDS = new Set(['HELP', 'AYUDA', 'INFO']);

export async function POST({ request }) {
  const form = await request.formData();
  const phone = form.get('From') ?? '';
  const body = (form.get('Body') ?? '').trim();
  const bodyUpper = body.toUpperCase();

  // --- STOP: record opt-out and return empty response (Twilio already blocked delivery)
  if (STOP_KEYWORDS.has(bodyUpper)) {
    await setSmsOptedOut(phone);
    return smsEmpty();
  }

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);

  // --- HELP
  if (HELP_KEYWORDS.has(bodyUpper)) {
    return sms(lang.smsPrompts.help);
  }

  // --- NEW CONTACT
  if (!respondent) {
    await upsertRespondent(phone);
    await setSmsState(phone, 'optin_pending');
    // Use English opt-in for first contact (language not yet known)
    return sms(getLang('en').smsPrompts.optIn);
  }

  const state = respondent.sms_state ?? 'optin_pending';

  // --- OPTIN_PENDING: waiting for YES/SÍ
  if (state === 'optin_pending') {
    if (OPTIN_KEYWORDS.has(bodyUpper)) {
      await setSmsOptedIn(phone);
      await setSmsState(phone, 'language_select');
      return sms(getLang('en').smsPrompts.welcome);
    }
    // Any other message — re-send opt-in prompt
    return sms(getLang('en').smsPrompts.optIn);
  }

  // --- LANGUAGE_SELECT
  if (state === 'language_select') {
    const language = body === '1' ? 'es' : 'en';
    await setLanguage(phone, language);
    await setSmsState(phone, 'intro');
    return sms(getLang(language).smsPrompts.nameChurch);
  }

  // From here on, language is known
  const p = lang.smsPrompts;

  // --- INTRO: save name + church, send Q1
  if (state === 'intro') {
    await setIntroText(phone, body);
    const q = lang.questions[0];
    await setSmsState(phone, 'question_1');
    return sms(`${q.text}\n\n${p.questionInstruction}`);
  }

  // --- QUESTION_N states
  const qMatch = state.match(/^question_(\d+)$/);
  if (qMatch) {
    const currentN = parseInt(qMatch[1], 10);

    // Navigation shortcut: body is a single number 1–TOTAL_QUESTIONS
    const jump = parseInt(body, 10);
    if (!isNaN(jump) && jump >= 1 && jump <= TOTAL_QUESTIONS && String(jump) === body) {
      const jumpQ = lang.questions.find(q => q.number === jump);
      await setSmsState(phone, `question_${jump}`);
      return sms(`${jumpQ?.text ?? ''}\n\n${p.questionInstruction}`);
    }

    // Save answer
    await saveTextResponse(respondent.id, currentN, body);

    // Find next unanswered (treat current as answered)
    const answered = await getAnswered(respondent.id);
    const answeredFull = [...new Set([...answered, currentN])];
    const nextN = getNextUnanswered(answeredFull);

    if (!nextN) {
      // All done
      await setSmsState(phone, 'done');
      if (!respondent.completed_at) {
        await markCompleted(phone);
        try {
          const full = await getFullRespondent(phone);
          await sendCompletionEmail(full, lang);
        } catch (err) {
          console.error('SMS completion email failed:', err);
        }
      }
      return sms(p.allDone);
    }

    const nextQ = lang.questions.find(q => q.number === nextN);
    await setSmsState(phone, `question_${nextN}`);
    return sms(p.afterAnswer(nextN, nextQ?.text ?? ''));
  }

  // --- DONE: allow re-answering by number
  if (state === 'done') {
    const jump = parseInt(body, 10);
    if (!isNaN(jump) && jump >= 1 && jump <= TOTAL_QUESTIONS && String(jump) === body) {
      const jumpQ = lang.questions.find(q => q.number === jump);
      await setSmsState(phone, `question_${jump}`);
      return sms(`${jumpQ?.text ?? ''}\n\n${p.questionInstruction}`);
    }
    return sms(p.alreadyDone);
  }

  // --- RETURNING: no sms_state set (voice-only respondent texting for first time)
  const answered = await getAnswered(respondent.id);
  const nextN = getNextUnanswered(answered);

  if (!nextN) {
    await setSmsState(phone, 'done');
    return sms(p.alreadyDone);
  }

  // Re-send opt-in for returning voice users who haven't opted in to SMS
  if (!respondent.sms_opted_in_at) {
    await setSmsState(phone, 'optin_pending');
    return sms(getLang('en').smsPrompts.optIn);
  }

  // Resume from where they left off
  await setSmsState(phone, `question_${nextN}`);
  const nextQ = lang.questions.find(q => q.number === nextN);
  return sms(`${p.welcomeBack(answered)}\n\nQ${nextN}: ${nextQ?.text ?? ''}\n\n${p.questionInstruction}`);
}
