const mongoose = require("mongoose");
const userModel = require("./user.model")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId

const budgetEntry = new Schema({
    budgetEntry : ObjectId,
    purchaseName : String,
    purchaseType : {
        type : String,
        enum : ['investment','fun','accessory','essential','food'],
        default : 'accessory',
        message: 'X',
        required : true
    },
    purchaseCost : Number,
    purchaseMethod : {
        type : String,
        enum : ['debit','credit','cash'],
        required:  true,
        message: 'X'
    },
    purchaseDate : {
        type: Date,
        default : Date.now()
    },
    userPhone: {
        type: String,
        required: true,
    }
})

budgetEntry.path('purchaseType').set((v) =>{
    return v.toLowerCase()
})

budgetEntry.path('purchaseCost').set((v)=>{
    return parseFloat(v.replace('$',''))
})

const checkPhone = async (phone) => {
    let res = await userModel.findOne({phone: phone}).exec()
    return res != null //returns false if not found
}
budgetEntry.methods.confirm = async function confirm(){
    if(this.purchaseType == 'X'){ 
        return 'purchase type not accepted'
    }
    if(this.purchaseMethod == 'X'){
        return 'purchase method not accepted'
    }
    if(await !checkPhone(this.userPhone)){
        return "phone number doesn't exit"
    }
    return `you just purchased ${this.purchaseName}`
    
  
}


module.exports = mongoose.model("budget-sms-table",budgetEntry)