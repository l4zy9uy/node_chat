const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router
    .get('/', conversationController.getRecentConversation)
    .get('/:roomId', conversationController.getConversationByRoomId)
    .post('/initiate', conversationController.initiate)
    .post('/:roomId/message', conversationController.postMessage)
    .put('/:roomId/mark-read', conversationController.markConversationReadByRoomId);

module.exports = router;