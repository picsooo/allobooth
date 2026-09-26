// Envoi des demandes de soumission Allôbooth via Resend
const T = {
  fr: {
    subjectAdmin: (c) => `Nouvelle demande de soumission — ${c || 'Site web'}`,
    subjectUser: 'Votre demande a bien été reçue — Allôbooth',
    head: 'Nouvelle demande de soumission',
    lead: 'Une demande vient d’être envoyée depuis le site allobooth.ca.',
    reply: 'Répondre au client',
    fields: {
      company: 'Entreprise', name: 'Contact', email: 'Courriel', phone: 'Téléphone',
      date: 'Date de l’événement', place: 'Lieu', type: 'Type d’événement',
      guests: 'Participants', pack: 'Formule souhaitée', message: 'Précisions'
    },
    userHead: 'Merci, votre demande est bien arrivée.',
    userLead: 'Nous revenons vers vous dans les heures qui suivent avec une soumission détaillée. Voici le récapitulatif de votre demande :',
    userFoot: 'Une question entre-temps ? Répondez simplement à ce courriel ou appelez-nous au (438) 506-8560.',
    recap: 'Votre demande'
  },
  en: {
    subjectAdmin: (c) => `New quote request — ${c || 'Website'}`,
    subjectUser: 'We received your request — Allôbooth',
    head: 'New quote request',
    lead: 'A request has just been sent from allobooth.ca.',
    reply: 'Reply to the client',
    fields: {
      company: 'Company', name: 'Contact', email: 'Email', phone: 'Phone',
      date: 'Event date', place: 'Venue', type: 'Event type',
      guests: 'Guests', pack: 'Preferred package', message: 'Details'
    },
    userHead: 'Thank you, your request has arrived.',
    userLead: 'We will get back to you within hours with a detailed quote. Here is a summary of your request:',
    userFoot: 'A question in the meantime? Just reply to this email or call us at (438) 506-8560.',
    recap: 'Your request'
  }
};

const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function rows(t, d) {
  const f = t.fields;
  const list = [
    [f.company, d.company], [f.name, d.name], [f.email, d.email], [f.phone, d.phone],
    [f.date, d.date], [f.place, d.place], [f.type, d.type], [f.guests, d.guests],
    [f.pack, d.pack], [f.message, d.message]
  ].filter(([, v]) => v && String(v).trim());
  return list.map(([k, v]) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #EDEAE3;color:#6B6B72;font-size:13px;width:38%;vertical-align:top">${esc(k)}</td>
      <td style="padding:12px 0;border-bottom:1px solid #EDEAE3;color:#16161A;font-size:15px;font-weight:600;vertical-align:top">${esc(v).replace(/\n/g, '<br>')}</td>
    </tr>`).join('');
}

function shell(inner) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2F1ED;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F1ED;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px -20px rgba(0,0,0,.35)">
<tr><td style="background:#16161A;padding:24px 32px">
  <img src="https://allobooth.ca/assets/logo-allobooth.png" width="150" height="42" alt="Allôbooth" style="display:block;border:0;outline:none;width:150px;height:auto">
</td></tr>
${inner}
<tr><td style="background:#0D0D10;padding:22px 32px;color:rgba(247,245,240,.6);font-size:12px;line-height:1.6">
  Allôbooth · 26, rue Guilbault, Laval (Québec) H7N 4N3<br>
  (438) 506-8560 · <a href="mailto:contact@allobooth.ca" style="color:#E0A82E;text-decoration:none">contact@allobooth.ca</a> · <a href="https://allobooth.ca" style="color:#E0A82E;text-decoration:none">allobooth.ca</a>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function adminHtml(t, d) {
  return shell(`<tr><td style="padding:32px">
  <div style="display:inline-block;background:#FFF3E3;color:#B3600F;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 10px;border-radius:5px">${esc(t.head)}</div>
  <p style="margin:18px 0 22px;color:#6B6B72;font-size:15px;line-height:1.6">${esc(t.lead)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EDEAE3">${rows(t, d)}</table>
  <a href="mailto:${esc(d.email)}" style="display:inline-block;margin-top:26px;background:#E07B1F;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:8px">${esc(t.reply)}</a>
</td></tr>`);
}

function userHtml(t, d) {
  return shell(`<tr><td style="padding:32px">
  <h1 style="margin:0 0 14px;color:#16161A;font-size:23px;line-height:1.3;letter-spacing:-.4px">${esc(t.userHead)}</h1>
  <p style="margin:0 0 26px;color:#6B6B72;font-size:15px;line-height:1.65">${esc(t.userLead)}</p>
  <div style="color:#6B6B72;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">${esc(t.recap)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EDEAE3">${rows(t, d)}</table>
  <p style="margin:26px 0 0;color:#6B6B72;font-size:14px;line-height:1.65">${esc(t.userFoot)}</p>
</td></tr>`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const d = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (d.website) return res.status(200).json({ ok: true });            // piège anti-robots
    const lang = d.lang === 'en' ? 'en' : 'fr';
    const t = T[lang];
    if (!d.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) || !d.name) {
      return res.status(400).json({ error: 'invalid' });
    }
    const KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.MAIL_FROM || 'Allôbooth <contact@allobooth.ca>';
    const TO = (process.env.MAIL_TO || 'contact@allobooth.ca').split(',').map(s => s.trim());
    if (!KEY) return res.status(500).json({ error: 'not configured' });

    const send = (payload) => fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const r = await send({
      from: FROM, to: TO, reply_to: d.email,
      subject: t.subjectAdmin(d.company), html: adminHtml(t, d)
    });
    if (!r.ok) {
      const body = await r.text();
      console.error('resend admin error', r.status, body);
      return res.status(502).json({ error: 'send failed' });
    }
    // accusé de réception au prospect (best effort)
    try { await send({ from: FROM, to: [d.email], subject: t.subjectUser, html: userHtml(t, d) }); } catch (e) {}
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server' });
  }
}
