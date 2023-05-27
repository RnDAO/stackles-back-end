import express from 'express';
import { Request, Response } from 'express';
import {User, IUser} from '../Models/User';
import {Organisation, IOrganisation} from '../Models/Organisation';
import {auth} from '../Middlewares/auth';
import { Collection } from '../Models/Collection';
import { Link } from '../Models/Link';


const linkRouter : express.Router = express.Router();


linkRouter.post('/create/:id', auth, async (req : any, res : any) => {

    try {
        const url = req.body.url;
        const title = req.body.title;
        const tags = req.body.tags;
        const description = req.body.description;
        
        const creator =await User.findById(req.user.id);
        const coll = await Collection.findById(req.params.id);
        if(!coll) {
            return res.status(404).json({msg: 'Collection not found'});
        }
        // check if the user is the admin of the collection
        if(!creator){
            return res.status(404).json({msg: 'User not found'});
        }

        if(  coll.admins &&  !coll.admins.includes(creator._id)) {
            return res.status(401).json({msg: 'Not authorised'});
        }
        if(!url || !title || !tags || !description) {
            return res.status(400).json({msg: 'Please enter all fields'});
        }
        const newLink = {
            link: url,
            title: title,
            tags: tags,
            description: description,
            creator: creator,
            coll: coll
        };
        
        const link = await new Link(newLink);
        await link.save();
        if(!coll.links) {
            coll.links = [link];
        }
        else{
            coll.links.push(link);
        }
        await coll.save();
        res.status(200).json({
            msg: 'Link added successfully',
            link: link
        });


        
    } catch (error) {
        res.status(500).json({
            msg: 'Internal Server Error',
            error: error
        });
    }

});


linkRouter.get('/all/:id', auth, async (req : any, res : any) => {
        try {
            const coll = await Collection.findById(req.params.id);
            if(!coll) {
                return res.status(404).json({msg: 'Collection not found'});
            }
            const user = await User.findById(req.user.id);
            if(!user) {
                return res.status(404).json({msg: 'User not found'});
            }
            if(coll.admins && !coll.admins.includes(user._id)) {
                return res.status(401).json({msg: 'Not authorised - you are not admin'});
            }
            
            if(!coll.links) {
                res.status(200).json({
                    msg: 'No links found',
                    links: []
                });
            }
            // populate the links array from the coll
             await coll.populate('links');
            res.status(200).json({
                msg: 'Links found',
                links: coll.links
            });
            

            
        } catch (error) {
            res.status(500).json({
                msg: 'Internal Server Error',
                error: error
            });
        }

});

export {linkRouter};