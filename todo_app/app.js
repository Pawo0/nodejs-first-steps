const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')

// teraz uzylem tylko dla put, w przyszlosci uzywaj require('fs').promises
const util = require('util')
const readFilePromise = util.promisify(fs.readFile)
const writeFilePromise = util.promisify(fs.writeFile)

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
                res.redirect('/');
            }
            catch (err){
                console.log("Error", err)
            }
        }
    })

})

app.get('/data', (req, res) =>{
    fs.readFile(path.resolve(__dirname, 'tasks.json'), 'utf8', (err, file) =>{
        if (!err){
            const data = JSON.parse(file);
            res.json(data);
        } else{
            res.json("Something gone wrong");
        }
    })
})

app.delete('/data/:id', (req, res) =>{
    const taskId = Number(req.params.id);
    fs.readFile(path.resolve(__dirname, 'tasks.json'), 'utf8', (err, file) =>{
        if (!err){
            const data = JSON.parse(file);
            const new_data = data.filter(obj => obj.id !== taskId);
            fs.writeFile(path.resolve(__dirname, 'tasks.json'), JSON.stringify(new_data), (err)=>{
                res.json({ message: `Error: ${err}` });
                res.end()
            })

            res.json({ message: 'Task updated' });
        } else{
            res.json("Something gone wrong");
        }
    })
    // res.redirect('/');
})

async function readTaskFromFile(){
    const data = await readFilePromise(path.resolve(__dirname, 'tasks.json'), 'utf8');
    return JSON.parse(data);
}

app.put('/data/:id', async (req, res) =>{
    const taskId = Number(req.params.id);
    try{
        let data = await readTaskFromFile();
        const taskIndex = data.findIndex(task => task.id === taskId);
        console.log(taskIndex, data)
        data[taskIndex].completed = !data[taskIndex].completed;
        await writeFilePromise(path.resolve(__dirname, 'tasks.json'), JSON.stringify(data))


        res.json({ message: 'Task updated', task: data[taskIndex] });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`)
})