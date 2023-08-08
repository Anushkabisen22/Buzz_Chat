const express=require('express');
const router=express.Router();
const validate=require('../middlewares/authMiddleware');
const { accessChats, fetchChats, createGroup, updateName, groupAdd, groupRemove } = require('../controllers/chatControllers');

router.route('/').post(validate,accessChats);
router.route('/').get(validate,fetchChats);
router.route('/group').post(validate,createGroup);
router.route('/rename').put(validate,updateName);
router.route('/gpAdd').put(validate,groupAdd);
router.route('/gpRemove').put(validate,groupRemove);


module.exports=router;