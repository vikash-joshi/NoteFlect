require('dotenv').config();

const mongoose=require('mongoose');
const mongoURI=process.env.Mongoose_URI;
const ConnectMongoose=()=>
{
    mongoose.connect(mongoURI);
    console.log('connected')
}


module.exports=ConnectMongoose