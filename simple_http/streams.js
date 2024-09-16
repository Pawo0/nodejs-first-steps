const fs = require('fs')
const stream = fs.createReadStream('./simple_http/file.txt', encoding = 'utf-8');

stream.on('open', (result) =>{
    console.log(result.read())
})
