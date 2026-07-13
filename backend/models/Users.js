import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return compare(enteredPassword, this.password);
};

export default model('User', userSchema);