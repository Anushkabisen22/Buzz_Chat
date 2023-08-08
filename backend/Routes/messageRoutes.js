const express=require('express');
const router=express.Router();
const validate=require('../middlewares/authMiddleware');
const {sendMessage,fetchMessage}=require('../controllers/messageControllers');
router.route('/').post(validate,sendMessage);

router.route('/:chatId').get(validate,fetchMessage);
module.exports=router;