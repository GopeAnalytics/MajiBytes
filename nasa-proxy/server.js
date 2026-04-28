const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
    return;
  }

  if (!req.url.startsWith('/nasa')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const queryString = req.url.replace('/nasa', '');
  const nasaURL = 'https://power.larc.nasa.gov/api/temporal/daily/point' + queryString;

  console.log('Fetching: ' + nasaURL);

  const options = {
    hostname: 'power.larc.nasa.gov',
    path: '/api/temporal/daily/point' + queryString,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  };

  https.get(options, (nasaRes) => {
    let data = '';
    
    nasaRes.on('data', chunk => { data += chunk; });
    
    nasaRes.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });

  }).on('error', (err) => {
    console.error('Error: ' + err.message);
    res.writeHead(500);
    res.end('Error: ' + err.message);
  });

}).listen(PORT, () => {
  console.log('NASA Proxy running on port ' + PORT);
});
