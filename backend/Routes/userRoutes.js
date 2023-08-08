const express=require('express');
const router=express.Router();
const validate=require('../middlewares/authMiddleware');
const {registerUser,loginUser,allUsers}=require('../controllers/userControllers')
router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/').get(validate,allUsers);
module.exports=router;