import express from 'express';
import { Request, Response } from 'express';

import { auth } from '../Middlewares/auth';
import { Organisation } from '../Models/Organisation';
import { Collection } from '../Models/Collection';
import { User } from '../Models/User';

const collRouter : express.Router = express.Router();


// create a collection
collRouter.post('/create/:id',auth, async (req: any, res: any)=>{
        
        try {
            const {name, description} = req.body;
            const org = req.params.id;
            if(!name || !description){
                res.status(400).json({
                    message: 'Bad request'
                })
            }else{
               // check if collection already exists
                const collection = await Collection.findOne({name: name, organisation: org});
                if(collection){
                    res.status(400).json({
                        message: 'Collection already exists'
                    })
                }else{
                    // check if the organisation exists 
                    const organisation = await Organisation.findById(org);
                    if(!organisation){
                        res.status(400).json({
                            message: 'Organisation does not exist'
                        })
                    }else{
                          // check if the user is the admin of the organisation
                        if(organisation.admins &&  organisation.admins.includes(req.user._id)){
                            const newCollection = new Collection({
                                name: name,
                                creator : req.user._id,
                                organisation: organisation._id,
                                description: description,
                                admins : [req.user._id]

                            });
                            await newCollection.save();
                            // add the collection to the organisation
                            if(organisation.collections){
                                organisation.collections.push(newCollection._id);
                            }else{
                                organisation.collections = [newCollection._id];
                            }
                            await organisation.save();
                          
                            // find user and add the collection to the user
                            const user = await User.findById(req.user._id);
                            if(user){
                            if(user.collections){
                                user.collections.push(newCollection._id);
                            }else{
                                user.collections = [newCollection._id];
                            }
                            await user.save();
                           
                        }
                            res.status(200).json({
                                newCollection,
                                message: 'Collection created successfully'
                            })

                    }

                    

                }
            }
        }
    }
         catch (error) {
            res.status(500).json({
                message: 'Internal server error',
                error: error
            })
        }
        
    }
)


// 









export default collRouter;