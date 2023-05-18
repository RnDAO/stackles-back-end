import mongoose, {Model,Document} from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { IOrganisation } from "./Organisation";
import { ICollection } from "./Collection";


require('dotenv').config();



// Define the User interface
interface IUser extends mongoose.Document {
    name: string;
    email: string; // also act as wallet address
   
    organisations?: IOrganisation[];
    collections?: ICollection[];
    O_requests?: IOrganisation[];
    // array of collection requests to join like id -> admin or id-> member
    // C_requests_admin?: ICollection[];
    // C_requests_member?: ICollection[];
    C_requests?: Map<ICollection, String>; // Mapping of ICollection to string


    generateAuthToken(): string;
}

// Define the schema
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, // also act as wallet address
    organisations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' }],
    O_requests: [{type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' }],
    // C_requests_admin: [{type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    // C_requests_member: [{type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    C_requests: {type: Map, of: String},

    collections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }]

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

