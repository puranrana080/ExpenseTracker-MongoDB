const express = require('express')
const router = express.Router()

const expenseController = require('../controller/expense')

const userauthentication = require('../middleware/auth')


router.get('/expense', expenseController.getExpenseFrom)

router.post('/expense/add-expense', userauthentication.authenticate, expenseController.postAddExpense)

// router.get('/expense/get-expense', userauthentication.authenticate, expenseController.getExpense)

// router.delete('/expense/delete-expense/:Id', userauthentication.authenticate, expenseController.deleteExpense)




module.exports = router