const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')

const PORT = 3000

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.post('/add_to_list', (req, res) =>{
    let task = req.body.task;
    const new_task = {
        id: Date.now(),
        task: task,
        completed: false
    }
    fs.readFile(path.resolve(__dirname, 'tasks.json'), 'utf8', (err, file) =>{
        if (err){
            res.send("errorik")
        }
        else{
            try{
                console.log("Data", file);
                const data = JSON.parse(file);
                data.push(new_task);
                fs.writeFileSync(path.resolve(__dirname, 'tasks.json'), JSON.stringify(data));
                res.json(new_task);
            }
            catch (err){
                console.log("Error", err)
            }
        }
    })

})

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`)
})