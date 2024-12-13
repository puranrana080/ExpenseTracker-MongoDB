const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: { type: Boolean, default: false },
  totalAmount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
