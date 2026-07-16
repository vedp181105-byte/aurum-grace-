const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // stored as bcrypt hash, never plain text
  phone:    { type: String, default: '' },
}, { timestamps: true });

// Never send the password hash back to the client
userSchema.methods.toSafeJSON = function () {
  return {
    id:        this._id,
    name:      this.name,
    email:     this.email,
    phone:     this.phone,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
