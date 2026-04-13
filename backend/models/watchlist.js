const { Schema, model } = require('mongoose');

const watchlistSchema=new Schema({
    name:{
        type :String,
        required:true, 
    },
    coverImageUrl:{
        type : String,
        default : '',
    },
    userId:{
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    }

}, {timestamps : true});

const Watchlist = model('Watchlist', watchlistSchema);

module.exports=Watchlist;