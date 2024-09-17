const express = require('express');
const router = express.Router();
const {
    getAllTasks,
    addTask,
    deleteTask,
    updateCompletedTask
} = require('../controllers/tasks')

router.get('/', getAllTasks)
router.post('/add_to_list', addTask)
router.delete('/:id', deleteTask)
router.patch('/:id', updateCompletedTask)

module.exports = router