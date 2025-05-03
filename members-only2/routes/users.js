const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController');

router.get('/sign-up', userController.sign_up_get);
router.post('/sign-up', userController.sign_up_post);
router.get('/log-in', userController.log_in_get);
router.post('/log-in', userController.log_in_post);
router.get('/log-out', userController.log_out);
router.get('/join-club', userController.join_club_get);
router.post('/join-club', userController.join_club_post);
router.get('/admin', userController.admin_get);
router.post('/admin', userController.admin_post);
module.exports=router;