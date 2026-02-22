function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function twiml(inner) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  );
}

export function say(text, voice) {
  return `<Say voice="${voice}">${escapeXml(text)}</Say>`;
}

// Navigation gather — waits for digits + pound, or just pound for "next"
export function navGather(action, voice, prompt) {
  return `<Gather finishOnKey="#" timeout="15" action="${action}" method="POST">${say(prompt, voice)}</Gather>`;
}

// Single-digit gather for language selection
export function digitGather(action, voice, prompt, numDigits = 1) {
  return `<Gather numDigits="${numDigits}" timeout="8" action="${action}" method="POST">${say(prompt, voice)}</Gather>`;
}

export function record(action, maxLength = 300) {
  return `<Record action="${action}" method="POST" finishOnKey="#" maxLength="${maxLength}" playBeep="true"/>`;
}

export function redirect(url) {
  return `<Redirect method="POST">${url}</Redirect>`;
}

export function hangup() {
  return `<Hangup/>`;
}