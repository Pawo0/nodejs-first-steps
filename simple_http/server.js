const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const http = require('http');
const server = http.createServer((req, res) =>{
    if (req.url === '/'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Hello there!');
    } else if (req.url === '/contact'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Contact');
    } else if (req.url === '/file'){
        res.statusCode = 200;
        const file = start();
        file.then((result) => res.end(result))
            .catch((err) => console.log(err));
    }
    else{
        // res.statusCode = 404;
        // res.setHeader('Content-Type', 'text/html');
        res.writeHead(404, {'Content-Type' : 'text/html'})
        res.end('<h1>Not found!</h1>');

    }
});
const port = 3000;
server.on("connection", (socket) =>{
    console.log('connected');
})

server.listen(port, () => {
    console.log(`Server is working on port ${port}`);
});
const start = async () =>{
    await writeFile('./simple_http/file.txt', 'Siema siema to plik nowy jak co heheh \n', {flag: 'a'});
    return await readFile('./simple_http/file.txt');

}