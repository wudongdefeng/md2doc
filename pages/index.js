/* globals document */
import React, { useState, useRef } from 'react';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import '../styles/globals.css';

export default function Home() {
  const [markdown, setMarkdown] = useState('# 示例文档\n\n这是一个更漂亮的在线 Markdown 转 Word 示例。');
  const [title, setTitle] = useState('示例文档');
  const [css, setCss] = useState('body { font-family: "Helvetica Neue", Arial, sans-serif; } h1 { color: #0b5cff }');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const mdRef = useRef(null);

  async function handleConvert(e) {
    e && e.preventDefault();
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
      setMessage('转换完成，已开始下载');
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
    <div className="container">
      <Head>
        <title>md2doc - Markdown 转 Word</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <h1>md2doc</h1>
        <p className="tagline">把 Markdown 快速转换成 Word (.docx)。支持自定义样式和实时预览。</p>
      </header>

      <main className="main">
        <div className="left">
          <div className="controls">
            <label className="file">上传 .md 文件： <input type="file" accept=".md,.markdown" onChange={handleFile} /></label>
            <label className="title">文档标题（可选）： <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="文档标题" /></label>
            <button className="primary" onClick={handleConvert} disabled={loading}>{loading ? '转换中...' : '转换并下载 .docx'}</button>
            <div className="status">{message}</div>
          </div>

          <label className="editorLabel">Markdown 文本：</label>
          <textarea ref={mdRef} className="editor" value={markdown} onChange={(e)=>setMarkdown(e.target.value)} />

          <label className="editorLabel">自定义 CSS（可选）：</label>
          <textarea className="cssarea" value={css} onChange={(e)=>setCss(e.target.value)} />
        </div>

        <aside className="right">
          <h2>实时预览</h2>
          <div className="preview">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
          <div className="help">
            <h3>提示</h3>
            <ul>
              <li>支持标题、列表、代码块、表格等常见 Markdown 语法。</li>
              <li>通过自定义 CSS 可以控制导出到 Word 的基本样式（字体、段落间距等）。</li>
              <li>部署到 Vercel 后可直接在互联网上访问。</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="footer">Powered by md2doc · 部署到 Vercel</footer>
    </div>
  );
}
