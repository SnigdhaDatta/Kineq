const {Schema, model} = require('mongoose');

const ongoingSchema=new Schema({
    name:{
        type :String,
        required:true, 
    },
    coverImageUrl:{
        type : String,
        default : '',
    },
    episode:{
        type : Number,
        default : 1,
    },
    userId:{
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    }
}, {timestamps : true});

const Ongoing = model('Ongoing', ongoingSchema);

module.exports=Ongoing;