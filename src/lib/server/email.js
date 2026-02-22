import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCompletionEmail(respondent, langData) {
  const rows = respondent.responses.map(r => {
    const q = langData.questions.find(q => q.number === r.question_num);
    return `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;width:30px">
          Q${r.question_num}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;vertical-align:top;color:#444;font-size:14px">
          ${q?.text ?? ''}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;vertical-align:top;white-space:nowrap">
          <a href="${r.recording_url}" style="color:#2563eb">▶ Listen</a>
          <span style="color:#999;font-size:12px">&nbsp;${r.duration_sec}s</span>
        </td>
      </tr>
    `;
  }).join('');

  const completedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  await resend.emails.send({
    from: 'survey@smallcitieslab.org',
    to: 'hello@smallcitieslab.org',
    subject: `Faith & Home Survey Completed — ${respondent.phone}`,
    html: `
      <div style="font-family:sans-serif;max-width:700px;margin:0 auto">
        <h2 style="color:#1e293b">Faith &amp; Home Survey — New Submission</h2>
        <table style="margin-bottom:24px;font-size:14px">
          <tr><td style="color:#64748b;padding:4px 16px 4px 0">Phone</td><td>${respondent.phone}</td></tr>
          <tr><td style="color:#64748b;padding:4px 16px 4px 0">Language</td><td>${respondent.language === 'es' ? 'Spanish' : 'English'}</td></tr>
          <tr><td style="color:#64748b;padding:4px 16px 4px 0">Completed</td><td>${completedAt}</td></tr>
          ${respondent.intro_url ? `<tr><td style="color:#64748b;padding:4px 16px 4px 0">Name &amp; Church</td><td><a href="${respondent.intro_url}" style="color:#2563eb">▶ Listen</a></td></tr>` : ''}
        </table>
        <h3 style="color:#1e293b;border-top:2px solid #e2e8f0;padding-top:16px">Responses</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows}
        </table>
        <p style="color:#94a3b8;font-size:12px;margin-top:32px">
          Small Cities Lab · Faith &amp; Home Research Project
        </p>
      </div>
    `,
  });
}