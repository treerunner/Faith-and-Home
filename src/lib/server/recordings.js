import { put } from '@vercel/blob';

export async function saveToBlobFromTwilio(twilioUrl, filename) {
  const credentials = Buffer.from(
    `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
  ).toString('base64');

  // Twilio needs a brief moment to finalize the recording
  await new Promise(resolve => setTimeout(resolve, 1500));

  let attempts = 0;
  while (attempts < 3) {
    const res = await fetch(`${twilioUrl}.mp3`, {
      headers: { Authorization: `Basic ${credentials}` }
    });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const { url } = await put(filename, buffer, {
        access: 'public',
        contentType: 'audio/mpeg',
      });
      return url;
    }

    attempts++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(`Failed to fetch Twilio recording after 3 attempts: ${twilioUrl}`);
}