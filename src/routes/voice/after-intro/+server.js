import { twiml, say, navGather, redirect } from '$lib/server/twiml.js';
import { getRespondent, setIntroUrl } from '$lib/server/db.js';
import { getLang } from '$lib/server/survey.js';
import { saveToBlobFromTwilio } from '$lib/server/recordings.js';

export async function POST({ request }) {
  const form = await request.formData();
  const phone = form.get('From');
  const recordingUrl = form.get('RecordingUrl');

  const respondent = await getRespondent(phone);
  const lang = getLang(respondent?.language);

  // Save name/church recording to Blob
  if (recordingUrl) {
    try {
      const blobUrl = await saveToBlobFromTwilio(
        recordingUrl,
        `faith-home/${phone}/intro-${Date.now()}.mp3`
      );
      await setIntroUrl(phone, blobUrl);
    } catch (err) {
      console.error('Failed to save intro recording:', err);
    }
  }

  return twiml(
    say(lang.prompts.navigationFirst, lang.voice) +
    navGather('/voice/navigate', lang.voice, lang.prompts.navigationFirst) +
    redirect('/voice/navigate')
  );
}