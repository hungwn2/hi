const Message = require('../models/message');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.message_list = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      include: User,
      order: [['timestamp', 'DESC']],
    });
    
    res.render('messages', {
      title: 'Message Board',
      messages,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

exports.message_create_get = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/log-in');
  }
  
  res.render('message-form', {
    title: 'Create Message',
    errors: null,
    message: null,
  });
};
exports.message_create_post = [
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be specified.'),
  body('content').trim().isLength({ min: 1 }).escape().withMessage('Content must be specified.'),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      
      const message = {
        title: req.body.title,
        content: req.body.content,
        userId: req.user.id,
      };
      
      if (!errors.isEmpty()) {
        return res.render('message-form', {
          title: 'Create Message',
          message,
          errors: errors.array(),
        });
      }
      
      await Message.create(message);
      
      res.redirect('/messages');
    } catch (err) {
      return next(err);
    }
  },
];

exports.message_delete = async (req, res, next) => {
  try {
    if (!req.isAuthenticated() || req.user.membership_status !== 'admin') {
      return res.redirect('/messages');
    }
    
    await Message.destroy({ where: { id: req.params.id } });
    res.redirect('/messages');
  } catch (err) {
    next(err);
  }
};