// routes/messages.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.message_list);
router.get('/create', messageController.message_create_get);
router.post('/create', messageController.message_create_post);
router.get('/:id/delete', messageController.message_delete);
module.exports=router;