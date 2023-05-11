import mongoose from "mongoose";
import { IUser, User } from "./User";
import { ICollection, Collection } from "./Collection";


// Define the schema
interface IOrganisation extends mongoose.Document {
    name: string;
    creator: IUser;
    admins?: IUser[];
    members?: IUser[];
    collections?: ICollection[];
}

const OrganisationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    members: [{type: [mongoose.Schema.Types.ObjectId], ref: 'User' }],
    collections: [{type: [mongoose.Schema.Types.ObjectId], ref: 'Collection' }]
});

// Define the model
const Organisation = mongoose.model<IOrganisation>('Organisation', OrganisationSchema);

// export the Organisation and IOrganisation
export {Organisation, IOrganisation};
