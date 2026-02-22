import { put } from '@vercel/blob';

export async function saveToBlobFromTwilio(twilioUrl, filename) {
  const credentials = Buffer.from(
    `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
  ).toString('base64');

  const res = await fetch(`${twilioUrl}.mp3`, {
    headers: { Authorization: `Basic ${credentials}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Twilio recording: ${twilioUrl} — status ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  const { url } = await put(filename, buffer, {
    access: 'public',
    contentType: 'audio/mpeg',
  });

  return url;
}