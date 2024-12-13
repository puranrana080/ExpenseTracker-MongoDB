const express = require('express')
const router = express.Router()
const authenticatemiddleware=require('../middleware/auth')
const premiumFeatureController=require('../controller/premiumfeatures')

router.get('/premium/showleaderboard',authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard)


module.exports=router