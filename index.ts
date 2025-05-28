import express from 'express';
import multer from 'multer';
import fs from 'fs';
import RateLimit from 'express-rate-limit';
const limiter = new RateLimit({
  windowMs: parseInt(process.env.WINDOW_MS, 10),
  max: parseInt(process.env.MAX_IP_REQUESTS, 10),
  delayMs:parseInt(process.env.DELAY_MS, 10),
  headers: true
});

app.use(limiter);
import path from 'path';

export const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded: ${req.file.filename}`);
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', () => {
    res.status(404).send('File not found');
  });
  fileStream.pipe(res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
