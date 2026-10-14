const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { mdToDocxFromMarkdown } = require('./convert');

const upload = multer();
const app = express();
app.use(cors());
app.use(express.static('public'));

// Accept either a file upload (field name 'file') or a text field 'markdown'
app.post('/api/convert', upload.fields([{ name: 'file' }, { name: 'cssFile' }]), async (req, res) => {
  try {
    let md = '';
    if (req.files && req.files.file && req.files.file.length > 0) {
      md = req.files.file[0].buffer.toString('utf8');
    } else if (req.body && req.body.markdown) {
      md = req.body.markdown;
    } else {
      return res.status(400).json({ error: 'No markdown provided' });
    }

    let css = '';
    if (req.files && req.files.cssFile && req.files.cssFile.length > 0) {
      css = req.files.cssFile[0].buffer.toString('utf8');
    } else if (req.body && req.body.css) {
      css = req.body.css;
    }

    const title = (req.body && req.body.title) ? req.body.title : undefined;
    const buffer = await mdToDocxFromMarkdown(md, { css, title });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Conversion failed' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(require('path').resolve(__dirname, '../public/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`md2doc server listening at http://localhost:${port}`);
});
