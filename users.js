const express = require('express');
const router = express.Router();
const { listUsers, getUser, createUser, updateUser, deleteUser } = require('./userController');
const { validateCreateUser, validateUpdateUser } = require('./validators');

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUpdateUser, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;