const mongoose = require('mongoose');

var Memes= mongoose.model('memes',{
    name:{
        type:String,
        trim:true,
        required:true,
        minLength:1,
        maxLength:50,
        default:null
    },
    url:{
        type:String,
        required:true,
        trim:true,
        minLength:1,
        maxLength:500,
        default:null
    },
    caption:{
        type:String,
        trim:true,
        minLength:1,
        maxLength:50,
        default:null
    }
})

module.exports={
    Memes
}