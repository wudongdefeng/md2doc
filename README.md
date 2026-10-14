# md2doc

将 Markdown (.md) 转换为 Word 文档 (.docx) 的简单 CLI 工具，并提供一个本地运行的在线转换服务。

## 特性
- 将 Markdown 转为 HTML，再把 HTML 转为 .docx（保留标题、段落、列表、代码块、表格等）
- 提供 CLI（bin/md2doc.js）和在线转换（Express 服务器）两种方式
- 可选自定义 CSS，来控制文档样式

## 安装

1. 克隆仓库并进入目录：

   git clone https://github.com/wudongdefeng/md2doc.git
   cd md2doc

2. 安装依赖：

   npm install

## CLI 用法

本地运行：

npm run cli -- example/example.md -o example/output.docx

## 在线服务（本地运行）

运行服务器：

npm start

默认监听 http://localhost:3000 ，打开后可以上传 Markdown 或粘贴文本并直接下载转换后的 .docx 文件。

## 关于 .doc 与 .docx

目前工具输出为 .docx（更现代、更兼容）。如果你确实需要旧的 .doc（二进制）格式，我可以：
- 在服务器上调用 pandoc（或 LibreOffice headless）生成 .doc（需要系统安装 pandoc 或 libreoffice），或
- 把 .docx 用 libreoffice 转换为 .doc（需要安装 libreoffice）。

## 许可

MIT
