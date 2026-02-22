import { twiml, say, navGather, redirect } from '$lib/server/twiml.js';
import { getRespondent, saveResponse } from '$lib/server/db.js';
import { getLang, TOTAL_QUESTIONS } from '$lib/server/survey.js';
import { saveToBlobFromTwilio } from '$lib/server/recordings.js';

export async function POST({ request, params }) {
  const n = parseInt(params.n, 10);
  const form = await request.formData();
  const phone = form.get('From');
  const recordingUrl = form.get('RecordingUrl');
  const duration = parseInt(form.get('RecordingDuration') ?? '0', 10);

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);

  if (recordingUrl && !isNaN(n) && n >= 1 && n <= TOTAL_QUESTIONS) {
    try {
      const blobUrl = await saveToBlobFromTwilio(
        recordingUrl,
        `faith-home/${phone}/q${n}-${Date.now()}.mp3`
      );
      await saveResponse(respondent.id, n, blobUrl, duration);
    } catch (err) {
      console.error(`Failed to save recording for Q${n}:`, err);
    }
  }

  return twiml(
    navGather('/voice/navigate', lang.voice, lang.prompts.afterAnswer) +
    redirect('/voice/navigate')
  );
}