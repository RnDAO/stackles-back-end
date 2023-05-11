import mongoose, {Model,Document} from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

require('dotenv').config();



// Define the User interface
interface IUser extends mongoose.Document {
    name: string;
    email: string; // also act as wallet address
    // wallet_address?: string;
    organization?: string[];
    collections?: string[];
    generateAuthToken(): string;
}

// Define the schema
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, // also act as wallet address
    // wallet_address: {type: String, unique: true},
    organization: {type: [String]},
    collections: {type: [String]}
});

// Define the model
const JWT_SECRET = "alwaysnoteverything";
console.log(JWT_SECRET);
UserSchema.methods.generateAuthToken = function(): string {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      return jwt.sign({ email: this.email }, JWT_SECRET, {
        expiresIn: '1h',
      });

}


const User = mongoose.model<IUser>('User', UserSchema);



// export the user and iuser
export {User, IUser};

