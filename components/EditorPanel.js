import { useState } from 'react';

export default function EditorPanel() {
  const [markdown, setMarkdown] = useState('# 示例文档\n\n写点内容，然后点击导出');
  const [title, setTitle] = useState('示例文档');
  const [css, setCss] = useState(`body {
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #222222;
  margin: 0;
  padding: 0;
}

h1 { font-size: 24pt; margin: 0 0 0.5em; font-weight: 700; }
h2 { font-size: 18pt; margin: 0.9em 0 0.4em; font-weight: 600; }
h3 { font-size: 14pt; margin: 0.8em 0 0.3em; font-weight: 600; }

p { margin: 0 0 0.9em; }

a { color: #0b5cff; text-decoration: underline; }

ul, ol { margin: 0 0 0.9em 1.4em; }

code { font-family: Menlo, Monaco, "Courier New", monospace; background: #f6f8fa; padding: 2px 6px; border-radius: 4px; font-size: 10pt; }
pre { background: #f6f8fa; padding: 12px; border-radius: 6px; overflow: auto; font-family: Menlo, Monaco, "Courier New", monospace; font-size: 10pt; }

table { border-collapse: collapse; width: 100%; margin: 0 0 0.9em; }
table th, table td { border: 1px solid #dddddd; padding: 8px; text-align: left; }

thead th { background: #f3f4f6; }

img { max-width: 100%; height: auto; display: block; margin: 0.6em 0; }

blockquote { margin: 0 0 0.9em; padding-left: 12px; border-left: 4px solid #eee; color: #555555; }

hr { border: none; border-top: 1px solid #e6e6e6; margin: 1em 0; }

/* small helpers for Word-like spacing */
p, li { orphans: 3; widows: 3; }
`);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleConvert() {
    setLoading(true);
    setMessage('');
    try {
      const resp = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown, title, css })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        setMessage('转换失败: ' + (err.error || resp.statusText));
        setLoading(false);
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(title || 'converted').replace(/[^a-zA-Z0-9-_\.]/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage('转换完成，下载已开始');
    } catch (err) {
      setMessage('请求出错: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setMarkdown(reader.result); };
    reader.readAsText(f);
  }

  return (
    <section className="editor-panel">
      <div className="panel">
        <div className="panel-head">
          <div>
            <label className="small-label">文档标题</label>
            <input className="title-input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="文档标题（可选）" />
          </div>
          <div className="panel-actions">
            <label className="upload">
              上传 .md
              <input type="file" accept=".md,.markdown" onChange={handleFile} />
            </label>
            <button className="primary" onClick={handleConvert} disabled={loading}>{loading ? '转换中…' : '转换并下载'}</button>
          </div>
        </div>

        <textarea className="editor-area" value={markdown} onChange={(e)=>setMarkdown(e.target.value)} />

        <details className="css-details">
          <summary>自定义 CSS（可选）</summary>
          <textarea className="css-area" value={css} onChange={(e)=>setCss(e.target.value)} />
        </details>

        <div className="status-line">{message}</div>
      </div>
    </section>
  );
}
