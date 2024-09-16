const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('Hello World!' + req.url);
        res.end();
    }
})

server.on('connection', (socket) => {
    console.log('connection connected');
})

server.listen(8080);
console.log('Server started on port 8080');