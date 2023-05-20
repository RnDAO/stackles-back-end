import mongoose from "mongoose";
import { IUser, User } from "./User";
import { ICollection, Collection } from "./Collection";
import { request } from "https";


// Define the schema
interface IOrganisation extends mongoose.Document {
    name: String; // name of the organisation
    creator: IUser; // creator of the organisation
    
    // avatar of the organisation
    avatar?: String;

    use_case : String;
    admins? : [{
        user: IUser,
        role: String
    }];
    // range of members
    range_of_members?: String;
    no_of_members?: Number;
    collections?: ICollection[];
    requests?: IUser[];
}

const OrganisationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    avatar: {type: String, required: false},
    admins: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        role: {type: String, required: true}
    }],
    range_of_members: {type: String, required: true},
    no_of_members: {type: Number, required: true},
    use_case: {type: String, required: true},
    
    collections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    requests: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Define the model
const Organisation = mongoose.model<IOrganisation>('Organisation', OrganisationSchema);

// export the Organisation and IOrganisation
export {Organisation, IOrganisation};
