const mongoose =require('mongoose')

const blacklistTokenSchema= new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to added in the blacklist"]
    }
},{
    timestamps:true,
})
const blacklistTokenModel = mongoose.model("blacklisttokens",blacklistTokenSchema)

module.exports = blacklistTokenModel