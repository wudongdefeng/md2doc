import ReactMarkdown from 'react-markdown';

export default function PreviewPanel() {
  const example = '# 实时预览\n\n这是在右侧显示的预览，它会尽量模仿导出时的样式。';
  return (
    <aside className="preview-panel">
      <div className="preview-head">
        <h3>实时预览</h3>
      </div>
      <div className="preview-body">
        <ReactMarkdown>{example}</ReactMarkdown>
      </div>

      <div className="preview-footer">
        <h4>导出提示</h4>
        <ul>
          <li>表格、代码块会被保留。</li>
          <li>如果需要嵌入图片，请将图片地址写入 Markdown 并确保可访问。</li>
        </ul>
      </div>
    </aside>
  );
}
