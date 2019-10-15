import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

let userSchema = new Schema({
  local: {
    email: String,
    password: String,
  },
  google: {
    email: String,
    id: String,
    displayName: String,
    token: String,
  }
});

// userSchema.pre('save', async function(next){
//   //'this' refers to the current document about to be saved
//   const user = this;
  
//   //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
//   //your application becomes.
//   const hash = await bcrypt.hash(this.password, 10);
//   //Replace the plain text password with the hash and then store it
//   this.password = hash;
//   //Indicates we're done and moves on to the next middleware
//   next();
// });

userSchema.methods.isValidPassword = async function(password){
  const user = this;
  //Hashes the password sent by the user for login and checks if the hashed password stored in the 
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  
  return compare;
}
// Export the model
export default mongoose.model("User", userSchema);