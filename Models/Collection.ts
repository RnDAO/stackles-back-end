import mongoose from "mongoose";
import { IUser } from "./User";
import { IOrganisation } from "./Organisation";
import { ILink } from "./Link";

// Define the User interface
interface ICollection extends mongoose.Document {
    name: string;
    creator: IUser;
    organisation: IOrganisation;
    //type will be either private or team
    type: string; 

    // description :string;
    admins?: IUser[];
    members?: IUser[];
    links?: ILink[];
    // items?: string[];
    // requests?: Map<IUser, String>; // Mapping of ICollection to string

    tokenName?: string;
    tokenMintAddress?: string;
    tokenAmount?: string;
}

// Define the schema
const CollectionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    organisation: {type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true},
    type: {type: String, required: true},
    // description: {type: String, required: true},
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // items: {type: [String]},
    // requests: {type: Map, of: String},
    links: [{type: mongoose.Schema.Types.ObjectId, ref: 'Link'}],

    tokenName: {type: String},
    tokenMintAddress: {type: String},
    tokenAmount: {type: String}
    
});

// Define the model
const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);

// export the Collection and ICollection
export {Collection, ICollection};
