const mongoose = require("mongoose");

const AvailableSlotS = mongoose.Schema({
    TimeDate:{
        type : Date
    }
});
const Aslots = mongoose.model("Aslots", AvailableSlotS );

module.exports = Aslots; 