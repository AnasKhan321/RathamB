const mongoose = require("mongoose");

const BookedSlots = mongoose.Schema({
    TimeDate:{
        type : Date
    },
    studentname : {
        type: String  
    },
    uid : {
        type: String
    },
    suuid : {
        type: String
    }
});
const Bslots = mongoose.model("Bslots", BookedSlots );

module.exports = Bslots; 