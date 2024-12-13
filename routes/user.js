const express = require('express')
const router = express.Router()


const userauthentication=require('../middleware/auth')
const userController = require('../controller/user')
const purchaseController=require('../controller/purchase')
const expenseController=require('../controller/expense')
const premiumController=require('../controller/premiumfeatures')



router.get('/', userController.getRegisterForm)

router.post('/user/register', userController.postRegisterForm)

router.post("/user/login", userController.postLoginForm)

router.get('/user/ispremium',userauthentication.authenticate,purchaseController.checkUserPremium)

router.get('/user/download',userauthentication.authenticate,expenseController.downloadexpense)

router.get('/user/downloadlist',userauthentication.authenticate,premiumController.getUserDownloadList)


module.exports = router