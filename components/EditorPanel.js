import { useState } from 'react';

export default function EditorPanel() {
  const [markdown, setMarkdown] = useState('# 示例文档\n\n写点内容，然后点击导出');
  const [title, setTitle] = useState('示例文档');
  const [css, setCss] = useState('body { font-family: "Helvetica Neue", Arial, sans-serif; } h1 { color: #0b5cff }');
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
