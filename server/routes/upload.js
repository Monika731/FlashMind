const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/upload — accepts a PDF file, returns extracted text
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are supported' });
    }

    const parsed = await pdfParse(req.file.buffer);
    const text = parsed.text.trim();

    if (!text || text.length < 50) {
      return res.status(400).json({ error: 'PDF appears to be empty or image-only' });
    }

    res.json({ text, pages: parsed.numpages, chars: text.length });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

module.exports = router;
