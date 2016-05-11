var http = require('http'),
    fs = require("fs"),
    path = require('path');

http.createServer((request, response) => {
  console.log(`${request.method} ${request.url} HTTP/1.1`);
  if (request.headers) {
    for (var headerName in request.headers) {
      console.log(`${headerName}: ${request.headers[headerName]}`);
    }
  }
  if (request.method === 'GET') {
    if (request.url.startsWith('/api')) {
      if (request.url === '/api/users') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        var content = JSON.stringify([{
          id: 1,
          username: "jon"
        },{
          id: 2,
          username: "tom"
        }], null, 4);
        response.end(content, 'utf-8');
      } else {
        response.statusCode = 404;
        response.end();
      }
    } else {
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
      response.setHeader('Content-Type', 'text/html');
      var content = fs.readFileSync(filePath, { encoding: 'utf8' });
      response.end(content, 'utf-8');
      console.log("\n");
      console.log(`HTTP/1.1 ${response.statusCode} ${response.statusMessage}`);
    }
  } else {
    response.statusCode = 404;
    response.end();
  }
  console.log("\n");
}).listen(8080);

console.log("Server is running at 'http://localhost:8080/'");