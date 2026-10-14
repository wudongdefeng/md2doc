export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-left">
        <h1>把 Markdown 变成漂亮的 Word 文档</h1>
        <p className="lead">简洁、快速、可自定义样式。适合笔记、报告、导出文档和交付物。</p>
        <div className="hero-cta">
          <a className="primary large" href="#">开始转换（免费）</a>
          <a className="ghost" href="#features">了解更多</a>
        </div>
      </div>
      <div className="hero-right">
        <div className="mock">
          <div className="mock-header">示例预览</div>
          <div className="mock-body"># 示例标题\n\n- 列表项 1\n- 列表项 2</div>
        </div>
      </div>
    </section>
  );
}
