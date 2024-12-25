const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

    /* -------------------------------------------------------------------------- */
    /*                                 USER SCHEMA                                */
    /* -------------------------------------------------------------------------- */

const UserSchema = mongoose.Schema({
    name : {
        type:String,
        required:[true,'Please provide name'],
        maxLength: [50,'name max character 50']
    },
    email : {
        type:String,
        required:[true,'Please provide email'],
        unique:[true,'email already exists'],
    },
    password : {
        type:String,
        requied:[true, 'Please provide password'],
        minLength:[6,'password atleast 6 characters'],
        maxLength:[20,'password atmost 20 characters'],
    },
    byOAuth : {
        type:Boolean,
        default : false,
    }
})

UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.name,email:this.email,byOAuth:this.byOAuth},
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_LIFETIME
        }
    )
}
UserSchema.methods.comparePassword = async function(candidatePassword){
    // console.log(candidatePassword,this.password)
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}
UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Email already exists'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model("USER",UserSchema)