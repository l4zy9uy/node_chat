const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router
    .get('/', userController.onGetAllUsers)
    .post('/', userController.onCreateUser)
    .get('/:id', userController.onGetUserById)
    .delete('/:id', userController.onDeleteUserById);

module.exports = router;