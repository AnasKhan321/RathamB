const mongoose = require("mongoose");
const { randomUUID } = require('crypto');
const StudentS = mongoose.Schema({
  uid : {
    type : String 
  },
  upassword : {
    type: String
  },
  token: {
    type: 'UUID',
    default: () => randomUUID()
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Student = mongoose.model("Student", StudentS );

module.exports = Student; 