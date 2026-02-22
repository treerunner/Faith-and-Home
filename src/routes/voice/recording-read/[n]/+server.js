import { getRespondent, saveResponse, setIntroUrl } from '$lib/server/db.js';
import { saveToBlobFromTwilio } from '$lib/server/recordings.js';

export async function POST({ request, params }) {
  const form = await request.formData();
  const phone = form.get('From');
  const recordingUrl = form.get('RecordingUrl');
  const duration = parseInt(form.get('RecordingDuration') ?? '0', 10);
  const recordingStatus = form.get('RecordingStatus');
  const n = params.n;

  // Only process completed recordings
  if (recordingStatus !== 'completed') {
    return new Response('ok', { status: 200 });
  }

  if (!phone || !recordingUrl) {
    return new Response('ok', { status: 200 });
  }

  const respondent = await getRespondent(phone);
  if (!respondent) {
    return new Response('ok', { status: 200 });
  }

  try {
    if (n === 'intro') {
      const blobUrl = await saveToBlobFromTwilio(
        recordingUrl,
        `faith-home/${phone}/intro-${Date.now()}.mp3`
      );
      await setIntroUrl(phone, blobUrl);
    } else {
      const questionNum = parseInt(n, 10);
      if (!isNaN(questionNum)) {
        const blobUrl = await saveToBlobFromTwilio(
          recordingUrl,
          `faith-home/${phone}/q${questionNum}-${Date.now()}.mp3`
        );
        await saveResponse(respondent.id, questionNum, blobUrl, duration);
      }
    }
  } catch (err) {
    console.error(`Failed to save recording [${n}] for ${phone}:`, err);
  }

  return new Response('ok', { status: 200 });
}