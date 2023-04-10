const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Set up the server
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Define variables to store URLs and short URL IDs
const urls = {};
let nextId = 1;

// Endpoint to create short URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Check if the URL is valid
  const validUrlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!validUrlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate short URL and store it in urls object
  const shortUrl = nextId.toString();
  urls[shortUrl] = originalUrl;
  nextId++;

  // Return response with short URL
  return res.json({ original_url: originalUrl, short_url: shortUrl });
});
app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
  });
// Endpoint to redirect to original URL
app.get('/api/shorturl/:id', (req, res) => {
  const shortUrl = req.params.id;

  // Check if the short URL exists in urls object
  if (!urls.hasOwnProperty(shortUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Redirect to the original URL
  const originalUrl = urls[shortUrl];
  return res.redirect(originalUrl);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

