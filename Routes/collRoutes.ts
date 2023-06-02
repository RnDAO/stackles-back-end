import express from 'express';
import e, { Request, Response } from 'express';

import { auth } from '../Middlewares/auth';
import { Organisation } from '../Models/Organisation';
import { Collection, ICollection } from '../Models/Collection';
import { User } from '../Models/User';

const collRouter : express.Router = express.Router();


// create a collection
collRouter.post('/create/:id',auth, async (req: any, res: any)=>{
        
        try {
            const {name, type, tokenName,tokenMintAddress, tokenAmount} = req.body;
            const org = req.params.id;
            
            // console.log(name, type, org, req.user._id);
            if(!name || !type || !tokenAmount || !tokenMintAddress || !tokenName){
                res.status(400).json({
                    message: 'Bad request - name, type, tokenName, tokenMintAddress, tokenAmount are required'
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
                    // console.log(organisation);
                    if(!organisation){
                        res.status(400).json({
                            message: 'Organisation does not exist'
                        })
                    }else{
                          // check if the user is the admin of the organisation
                        // here the admins array is an array of objects
                        // admins? : [{
                        //     user: IUser,
                        //     role: String
                        // }];
                        // so we need to check if the user is present in the admins array
                    //    if(organisation.admins)  console.log( organisation.admins, organisation.admins.find(admin=>admin.user.toString()==req.user._id.toString()));
                        if(organisation.admins &&organisation.admins.length>0 && organisation.admins.find(admin=>admin.user.toString()===req.user._id.toString())){
                            // console.log('here');
                            const newCollection = new Collection({
                                name: name,
                                creator : req.user._id,
                                organisation: organisation._id,
                               type: type,
                                admins : [req.user._id],
                                tokenName: tokenName,
                                tokenMintAddress: tokenMintAddress,
                                tokenAmount: tokenAmount

                            });
                            await newCollection.save();
                            // add the collection to the organisation
                            // console.log(newCollection)
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
                            res.status(200).json({
                                newCollection,
                                message: 'Collection created successfully'
                            })
                           
                        }
                        else{
                            res.status(400).json({
                                message: 'User is not admin of the organisation'
                            })
                        }
                            

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


//  get all collections of an organisation
collRouter.get('/all/:id',auth, async (req: any, res: any)=>{
        try {
            const org = req.params.id;
            const organisation = await Organisation.findById(org);
            if(!organisation){
                res.status(400).json({
                    message: 'Organisation does not exist'
                })
            }else{
               const user = await User.findById(req.user._id);
                if(!user){
                    res.status(400).json({
                        message: 'User does not exist'
                    })
                }else{
                    if(user.organisations && user.organisations.includes(organisation._id)){
                        const collections = await Collection.find({organisation: organisation._id});
                        res.status(200).json({
                            collections
                        })
                    }else{
                        res.status(400).json({
                            message: 'User is not a member of the organisation'
                        })
                    }
                }
            }
            
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error',
                error: error
            })
            
        }
    })


// get a collection
collRouter.get('/:id',auth, async (req: any, res: any)=>{

    try {
        const user = await User.findById(req.user._id);
        if(!user){
            res.status(400).json({
                message: 'User does not exist'
            })
        }else{
            const collection = await Collection.findById(req.params.id);
            if(!collection){
                res.status(400).json({
                    message: 'Collection does not exist'
                })
            }else{
                if(user.collections && user.collections.includes(collection._id)){
                    res.status(200).json({
                        collection
                    })
                }else{
                    res.status(400).json({
                        message: 'User is not a member of the collection'
                    })
                }
            }
        }
        
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        
    }

})

// send a request to join a collection as a member or admin 

// collRouter.post('/request/:id',auth, async (req: any, res: any)=>{
//     try {
//         const user = await User.findById(req.user._id);
//         const collection  = await Collection.findById(req.params.id);
//         const email = req.body.email;
//         const role = req.body.role;
//         if(collection){
//         const organisation = await Organisation.findById(collection.organisation);
//         // check if the user exists or not 
//         const user_req = await User.findOne({email: email});
//         if(!user_req){
//             res.status(400).json({
//                 message: 'User does not exist'
//             })
//         }else{
//             // check if we already sent a request to this req_user
//             if(collection.requests && collection.requests.has(user_req._id)){
//                 res.status(400).json({
//                     message: 'Request already sent'
//                 })
//             }else{
//                 // check if the role is valid
//                 if(req.body.role === 'member' || req.body.role === 'admin'){
//                 // check the user is the admin of the collection bcz only admin can add members/ admins to the collection
        
//                     if(collection.admins && collection.admins.includes(req.user._id)){
//                         // check if the role is already assigned to the user
//                         if(role === "member" && collection.members && collection.members.includes(user_req._id)){
//                             res.status(400).json({
//                                 message: 'User is already a member of the collection'
//                             })
//                         }
//                         else if(role === "admin" && collection.admins && collection.admins.includes(user_req._id)){
//                             res.status(400).json({
//                                 message: 'User is already an admin of the collection'
//                             })
//                         }else{
//                             // add the request to the collection
//                             if(!collection.requests){
//                                 collection.requests = new Map();
//                             }
//                             collection.requests.set(user_req._id, role);
//                             await collection.save();
//                             // also add the request to the user
//                             if(!user_req.C_requests){
//                                 user_req.C_requests = new Map();
//                             }
//                             user_req.C_requests.set(collection._id, role);
//                             await user_req.save();
                        


//                             res.status(200).json({
//                                 message: 'Request sent successfully'
//                             })
//                         }
                        
//                     }else{
//                         res.status(400).json({
//                             message: 'Only admins can add members/ admins to the collection'
//                         })
//                     } 


//                 }
//                 else{
//                     res.status(400).json({
//                         message: 'Invalid role'
//                     })
//                 }
            
//             }

//         }

//     }else{
//         res.status(400).json({
//             message: 'Collection does not exist'
//         })
//     }

// }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: 'Internal server error',
//             error: error
//         })
// }

       

// })


// accept a request to join a collection as a member or admin






export default collRouter;