import mongoose from "mongoose";

// Define the User interface
interface IUser extends mongoose.Document {
    name: string;
    email: string;
    wallet_address?: string;
    organization?: string[];
    collections?: string[];
}

// Define the schema
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    wallet_address: {type: String, unique: true},
    organization: {type: [String]},
    collections: {type: [String]}
});

// Define the model
const User = mongoose.model<IUser>('User', UserSchema);

// export the user and iuser
export {User, IUser};

