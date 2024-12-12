const jwt = require('jsonwebtoken')

const User = require('../model/user')


const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization')
        console.log(token)
        const user = jwt.verify(token, 'secretecodeashdjkah')//decoded
        console.log(user.userId)
        console.log("yess",user)
        
        User.findById(user.userId)
            .then(user => {
                console.log("user",user)
                req.user = user
                next()
            })
            .catch(err => {
                throw new Error(err)
            })
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = { authenticate }