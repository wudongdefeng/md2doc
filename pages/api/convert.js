import { NextApiRequest, NextApiResponse } from 'next';
import { marked } from 'marked';
import htmlToDocx from 'html-to-docx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { markdown = '', title, css = '' } = req.body || {};
    const htmlBody = marked.parse(markdown || '');
    const titleHtml = title ? `<h1>${escapeHtml(title)}</h1>` : '';

    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${titleHtml}${htmlBody}</body></html>`;

    const bufferLike = await htmlToDocx(html, null, {});
    const buf = Buffer.from(bufferLike);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
    res.status(200).send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Conversion failed' });
  }
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
