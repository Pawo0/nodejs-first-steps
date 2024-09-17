const {readFile, writeFile} = require("fs").promises;
const path = require('path');
const asyncWrapper = require('../middleware/async')

async function readTaskFromFile() {
    const data = await readFile(path.resolve(__dirname, '../tasks.json'), 'utf8');
    return JSON.parse(data);
}
async function saveToFile(new_data){
    return writeFile(path.resolve(__dirname, '../tasks.json'), JSON.stringify(new_data))
}

const getAllTasks = asyncWrapper(async (req, res) => {
    try {
        const data = await readTaskFromFile();
        res.json(data);
    } catch (err) {
        console.log(err)
    }
})

const addTask = asyncWrapper(async (req, res) => {
    let task = req.body.task;
    const new_task = {
        id: Date.now(),
        task: task,
        completed: false
    }
    try {
        const data = await readTaskFromFile();
        data.push(new_task);
        await saveToFile(data);
        res.redirect('/');
        // res.json({ message: 'Task added' });
    } catch (err) {
        console.log("Error", err)
    }
})

const deleteTask = asyncWrapper(async (req, res) => {
    const taskId = Number(req.params.id);
    const data = await readTaskFromFile();
    const new_data = data.filter(obj => obj.id !== taskId);
    await saveToFile(new_data);
    res.json({message: 'Task updated'});
    // res.redirect('/');
})

const updateCompletedTask = asyncWrapper(async (req, res) => {
    const taskId = Number(req.params.id);
    try {
        let data = await readTaskFromFile();
        const taskIndex = data.findIndex(task => task.id === taskId);
        console.log(taskIndex, data)
        data[taskIndex].completed = !data[taskIndex].completed;
        await saveToFile(data);

        res.json({message: 'Task updated', task: data[taskIndex]});
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = {
    getAllTasks,
    addTask,
    deleteTask,
    updateCompletedTask
}