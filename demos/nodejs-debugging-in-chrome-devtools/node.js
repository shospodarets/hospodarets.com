// Node.js simple static server form https://gist.github.com/ryanflorence/701407

const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const port = process.argv[2] || 8033;

const server = http.createServer(function (request, response) {

    const uri = url.parse(request.url).pathname;
    if (path.normalize(decodeURI(uri)) !== decodeURI(uri)) {
        response.statusCode = 403;
        response.end();
        return;
    }
    let filename = path.join(process.cwd(), uri);

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            console.log('node.js: 404 Not Found');
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/");