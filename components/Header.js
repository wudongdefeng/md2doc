import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <img src="/logo.svg" alt="md2doc" className="logo" />
          <div>
            <div className="brand-title">md2doc</div>
            <div className="brand-sub">Markdown → Word</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#features">特性</a>
          <a href="#">文档</a>
          <a href="#">关于</a>
          <a className="btn" href="https://vercel.com/new">部署到 Vercel</a>
        </nav>
      </div>
    </header>
  );
}
