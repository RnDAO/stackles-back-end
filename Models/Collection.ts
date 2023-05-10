import mongoose from "mongoose";
import { IUser } from "./User";
import { IOrganisation } from "./Organisation";

// Define the User interface
interface ICollection extends mongoose.Document {
    name: string;
    creator: IUser;
    organisation: IOrganisation;
    admins?: IUser[];
    members?: IUser[];
    items?: string[];
}

// Define the schema
const CollectionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    organisation: {type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true},
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    members: [{type: [mongoose.Schema.Types.ObjectId], ref: 'User' }],
    items: {type: [String]}
});

// Define the model
const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);

// export the user and iuser
export {Collection, ICollection};
