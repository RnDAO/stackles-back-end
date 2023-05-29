import mongoose from "mongoose";
import { IUser } from "./User";
import { ICollection } from "./Collection";


interface ILink extends mongoose.Document {
    // name : string;
    link : string; // as the url of the link
    title : string; // as the title of the link
    tags : string[]; // as the tags of the link
    description ?: string; // as the description of the link
    creator : IUser; // as the creator of the link
    coll : ICollection; // as the collection of the link
}


const LinkSchema = new mongoose.Schema({
    // name : {type: String, required: true},
    link : {type: String, required: true},
    title : {type: String, required: true},
    tags : [{type: String}],
    description : {type: String},
    creator : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    coll : {type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true}
});

const Link = mongoose.model<ILink>('Link', LinkSchema);

export {Link, ILink};