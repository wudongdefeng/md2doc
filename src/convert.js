const fs = require('fs-extra');
const marked = require('marked');
const htmlToDocx = require('html-to-docx');

async function mdToDocxFromMarkdown(md, opts = {}) {
  const htmlBody = marked.parse(md || '');

  const titleHtml = opts.title ? `<h1>${escapeHtml(opts.title)}</h1>` : '';
  let css = '';
  if (opts.css) {
    css = opts.css;
  }

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
${css}
</style>
</head>
<body>
${titleHtml}
${htmlBody}
</body>
</html>`;

  const bufferLike = await htmlToDocx(html, null, {});
  return Buffer.from(bufferLike);
}

async function mdToDocx(inputPath, outputPath, opts = {}) {
  const md = await fs.readFile(inputPath, 'utf8');
  const buf = await mdToDocxFromMarkdown(md, opts);
  await fs.outputFile(outputPath, buf);
}

// simple escape for title
function escapeHtml(s) {
  return s.replace(/[&<>\"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

module.exports = { mdToDocx, mdToDocxFromMarkdown };
