const mongoose=  require('mongoose')
const Schema = mongoose.Schema
const {v4 :uuidv4} =require('uuid')

const forgotPasswordRequestSchema = new Schema({
    _id:{type:String,
        default:uuidv4
    },
    isActive:{
        type:Boolean,
        default:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true}
})

module.exports=mongoose.model('ForgotPasswordRequests',forgotPasswordRequestSchema)
// const Sequelize = require('sequelize')
// const sequelize = require('../util/user')
// const { v4: uuidv4 } = require('uuid')



// const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests', {
//     id: {
//         type:
//             Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         primaryKey: true
//     }, userId: Sequelize.INTEGER,
//     isactive: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: true
//     }

// })

// module.exports = ForgotPasswordRequests


