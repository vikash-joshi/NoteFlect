const bcrypt = require('bcrypt');

const GeneratePassword = async function GeneratePassword(PassObject){
    try{
    let Salt=await bcrypt.genSalt(5);
    let HashPassword=await bcrypt.hash(PassObject.Password,Salt);
    PassObject={ Password:HashPassword,Message:'1:' }
    }
    catch(ex){
        PassObject={ Password:'',Message:'0:'+ex.message }
    }
    return PassObject

}


module.exports = GeneratePassword;
