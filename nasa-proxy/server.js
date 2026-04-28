const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  // Health check
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
    return;
  }

  // Only handle /nasa path
  if (!req.url.startsWith('/nasa')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  // Build NASA POWER URL from query string
  const queryString = req.url.replace('/nasa', '').replace('/?', '?');
  const nasaURL = 'https://power.larc.nasa.gov/api/temporal/daily/point' + queryString;

  console.log('Fetching: ' + nasaURL);

  https.get(nasaURL, (nasaRes) => {
    res.writeHead(nasaRes.statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    nasaRes.pipe(res);
  }).on('error', (err) => {
    console.error('Error: ' + err.message);
    res.writeHead(500);
    res.end('Error: ' + err.message);
  });

}).listen(PORT, () => {
  console.log('NASA Proxy running on port ' + PORT);
});