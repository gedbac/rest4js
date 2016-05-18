const http = require('http');
const fs = require("fs");
const path = require('path');
const zlib = require('zlib');

http.createServer((request, response) => {
  console.log(`${request.method} ${request.url} HTTP/1.1`);
  if (request.headers) {
    for (var headerName in request.headers) {
      console.log(`${headerName}: ${request.headers[headerName]}`);
    }
  }
  var content = null;
  if (request.method === 'GET' && request.url.startsWith('/api/users')) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    content = JSON.stringify([{
      id: 1,
      username: "jon"
    },{
      id: 2,
      username: "tom"
    }], null, 4);
    var acceptEncoding = request.headers['accept-encoding'];
    if (acceptEncoding && acceptEncoding.indexOf('gzip') !== -1) {
      response.setHeader('Content-Encoding', 'gzip');
      var buffer = new Buffer(content, 'utf-8');
      zlib.gzip(buffer, (error, result) => {
        if (!error) {
          response.end(result);
        }
      });
    } else {
      response.end(content, 'utf-8');
    }
  } else if (request.method === 'GET') {
    var filePath = '.' + request.url;
    if (filePath == './') {
      filePath = './index.html';
    }
    var contentType = 'text/html';
    var fileExtension = path.extname(filePath);
    switch (fileExtension) {
      case '.js':
        contentType = 'text/javascript';
        break;
    }
    response.statusCode = 200;
    response.setHeader('Content-Type', contentType);
    content = fs.readFileSync(filePath, { encoding: 'utf8' });
    response.end(content, 'utf-8');
    console.log("\n");
    console.log(`HTTP/1.1 ${response.statusCode} ${response.statusMessage}`);
  } else {
    response.statusCode = 404;
    response.end();
  }
  console.log("\n");
}).listen(8080);

console.log("Server is running at 'http://localhost:8080/'");