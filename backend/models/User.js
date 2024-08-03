const mongoose=require('mongoose');
const {Schema}=mongoose;
const UserSchema=new Schema({
    name:{
        type: String,
        required: true,
        unique:true,

    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phoneNumber:{
        type: String,
        required: true,
    },
    password: {type: String,
        required: true
    },
    gender:{
        type: String,
    },
    UserBio : {
        type: String,
    },
    createdAt: {
        type: Date
    }   
    ,
    UserType:{
        type:String,
        required: true
    },
    IsEmailVerified:{
        type:Boolean
    },
    IsAccountLocked:{
        type:Boolean
    }
    
});


module.exports=mongoose.model('Users',UserSchema);