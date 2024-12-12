const express = require('express')
const router = express.Router()

const userauthentication = require('../middleware/auth')
const purchaseController = require('../controller/purchase')

router.get('/purchase/premiummembership', userauthentication.authenticate, purchaseController.purchasePremium)

router.post('/purchase/updatetransactionstatus',userauthentication.authenticate,purchaseController.updateTransactionStatus)

router.post('/purchase/failedtransactionstatus',userauthentication.authenticate,purchaseController.updateTransactionStatusToFailed)


module.exports = router