const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan')

let data = [{'id': 0, 'name': 'Jacob', 'age': 16}, {'id': 1, 'name': 'Agnes', 'age': 13}];

app.use(morgan('tiny'))

app.use('/data', auth);

function auth (req, res, next){
    const {pass} = req.query
    if (pass === "123") next()
    else res.status(401).end('Unauthorized connection ')
}

app.use(express.static(path.resolve(__dirname, 'public')))
app.get('/', (req, res)=>{
    res.status(200).end();
        // .sendFile(path.resolve(__dirname, 'index.html'))

})
app.get('/contact', (req, res) => {
    res.status(200).send('<h1>Contact!</h1>')
})
app.get('/data', (req, res) => {
    let newData = data.map((elements) => {
        const {name, age} = elements;
        return {name, age}
    })
    res.json(newData)

})
app.get('/data/:userID', (req, res) =>{
    const {userID} = req.params;
    let newData = data.find((obj) => obj.id === Number(userID))
    if (!newData){
        res.status(200).end('Not found');
    }
    else res.json(newData);
})
app.all('*', (req, res) => {
    res.status(404).send("<h1>Site not found!</h1> <a href='/'>go back</a>")
})

app.listen(3000, () => {
    console.log('Listening on 3000...');
})