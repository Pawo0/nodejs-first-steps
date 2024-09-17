const express = require('express')
const app = express()
const path = require('path')

const tasks = require('./routes/tasks')
const PORT = 3000

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/tasks', tasks);

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`)
})