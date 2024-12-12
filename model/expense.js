const mongoose = require('mongoose')
const Schema = mongoose.Schema

const expenseSchema= new Schema({
    amount:{
        type:Number,
        require:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }


})

module.exports=mongoose.model("Expense",expenseSchema)

// const Sequelize=require('sequelize')
// const sequelize=require('../util/user')


// const Expense=sequelize.define('expense',{
//     amount:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     description:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
//     category:{
//         type:Sequelize.STRING,
//         allowNull:false
//     }

// })

// module.exports= Expense