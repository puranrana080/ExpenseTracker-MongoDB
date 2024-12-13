const mongoose = require('mongoose')
const Schema=mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        required:true
    },
    isPremiumUser:{type:Boolean,
        default:false
    },
    totalAmount:{
        type:Number,
        default:0,
    }
})



module.exports=mongoose.model('User',userSchema);

// const Sequelize=require('sequelize')
// const sequelize=require('../util/user')


// const User=sequelize.define('users',{
//     userName:{
//         type:Sequelize.STRING,
//         allownull:false,

//     },
//     userEmail:{
//         type:Sequelize.STRING,
//         allownull:false,
//         unique:true
//     },
//     password:{
//         type:Sequelize.STRING,
//         allownull:false
//     },
//     ispremiumuser:Sequelize.BOOLEAN,
//      total_cost:Sequelize.FLOAT
// })

// module.exports=User