const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
// const { protect } = require('../middlewares/authMiddleware');


// Task CRUD routes without authentication
router.post('/', createTask); 
router.get('/', getTasks);    
router.put('/:id', updateTask); 
router.delete('/:id', deleteTask); 


// Task CRUD routes with authentication
// router.post('/', protect, createTask);
// router.get('/', protect, getTasks);
// router.put('/:id', protect, updateTask);
// router.delete('/:id', protect, deleteTask);

module.exports = router;