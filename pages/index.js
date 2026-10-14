import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';

export default function Home() {
  return (
    <>
      <Head>
        <title>md2doc · Markdown 转 Word</title>
        <meta name="description" content="在线把 Markdown 转成 Word (.docx)。支持自定义样式与实时预览。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <main className="site-main">
        <Hero />

        <section className="app-grid">
          <EditorPanel />
          <PreviewPanel />
        </section>

        <section className="features">
          <div className="feature">
            <h3>一键导出</h3>
            <p>支持粘贴、上传 .md，点击即可下载高质量 .docx。</p>
          </div>
          <div className="feature">
            <h3>自定义样式</h3>
            <p>通过 CSS 控制导出样式（字体、段落间距、表格样式等）。</p>
          </div>
          <div className="feature">
            <h3>响应式 & 安全</h3>
            <p>界面适配移动端；转换在服务器端完成，保证浏览器性能。</p>
          </div>
        </section>

      </main>
    </>
  );
}
