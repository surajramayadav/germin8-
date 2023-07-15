import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";


const storeScehma = new mongoose.Schema({
  name: {
    type: 'String',
    ref: '',
    required: true,
    maxlength: [255, 'name should be less than 255 character'],
    unique: false
  },
  location: [{
    lat: { type: 'String' },
    long: { type: 'String' },
    address: { type: 'String' },
    url: { type: 'String' },
  }],
  address: {
    landmark: { type: 'String' },
    address: { type: 'String' },
    time: { type: 'String' },

  }
}, {
  timestamps: true
});


export default mongoose.model("store", storeScehma);