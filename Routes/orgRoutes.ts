import express from 'express';
import { Request, Response } from 'express';
import {User, IUser} from '../Models/User';
import {Organisation, IOrganisation} from '../Models/Organisation';
import {auth} from '../Middlewares/auth';
import { IGetUserAuthInfoRequest } from '../definition';
import { v2 as cloudinary } from "cloudinary";


const orgRouter: express.Router = express.Router();


cloudinary.config({
    cloud_name: "dkfjb8xsm",
    api_key: "687961213743838",
    api_secret: "iTxPxJdfWwCVRZs_6nmo3F4bEG4"
  });
  


// create organisation route
orgRouter.post('/create', auth, async (req: any, res: any)=>{
    try {
        // get the name, avatar, use_case, range from the request body
        const name = req.body.name;
        const role = req.body.role;
        const use_case = req.body.use_case;
        const range = req.body.range;
        const desc = req.body.description;
        
        // console.log(req.file, req.body);
        // take the avatar from the request body as a file
        // const avatar = req.files.avatar;
        console.log(name, role, use_case, range, desc);
        if(!name || !use_case || !range || !role || !desc){
            res.status(400).json({
                message: 'plz fill all the fields'
            })
        }else{
            if(!req.user){
                res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            else{
            const user = req.user;
            if(user && user.organisations){
                const newOrg = new Organisation({
                    name: name,
                    creator: user._id,
                    admins : [{
                        user: user._id,
                        role: role
                    }],
                    range_of_members: range,
                    use_case: use_case,
                    no_of_members: 1,
                    description: desc
                });
                await newOrg.save();
                user.organisations.push(newOrg._id);
                await user.save();
                // check if the avatar exists
                // if(avatar && avatar.tempFilePath){
                //     // upload the avatar to cloudinary and save the url in the database
                //     const result = await cloudinary.uploader.upload(avatar.tempFilePath,
                //         {
                //             public_id: `stackles/avatars/${newOrg._id}`,
                //         }
    
                        
                //         );
                //     newOrg.avatar = result.secure_url;
                //     await newOrg.save();
                // }



                res.status(200).json({
                    newOrg,
                    message: 'Organisation created successfully'
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
}
)

// get all organisations route

orgRouter.get('/all', auth, async (req: any, res: any)=>{
    try {
        const user   = req.user;
        const organisations = await Organisation.find({_id: {$in: user.organisations}});
        res.status(200).json({
            organisations,
            message: 'Organisations fetched successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
    }
}
)



// get organisation by id route

orgRouter.get('/:id', auth, async (req: any, res: any)=>{

    try {
            const user   = req.user;
            const orgId = req.params.id;
            // check if the user is a member or admin of the organisation
            const org = await Organisation.findOne({_id: orgId, $or: [{admins: user._id}, {members: user._id}]});
            if(!org){
                res.status(401).json({
                    message: 'Unauthorized'
                })
            }   
            else{
                res.status(200).json({
                    org,
                    message: 'Organisation fetched successfully'
                })
            }


        
    } catch (error) {

        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        

    }

}
)


// send request to join organisation as admin  route

orgRouter.post('/join/:id', auth, async (req: any, res: any)=>{
    try {
        const user   = req.user;
        const orgId = req.params.id;
        const email = req.body.email;
        
        // check if we already sent the request to join the organisation
        const org = await Organisation.findOne({_id: orgId, admins: user._id});
        if(!org){
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
        else{
            if( org.requests && org.requests.includes(email)){
                res.status(400).json({
                    message: 'Bad request - request already sent'
                })
            }
            else{
                // check if the email exists in the database
                const checkUser = await User.findOne({email: email});
                if(!checkUser){
                    res.status(400).json({
                        message: 'Bad request - user not found'
                    })
                }
                else{
                        // check if the user is already an admin of the organisation
                        if(org.admins && org.admins.includes(checkUser._id)){
                            res.status(400).json({
                                message: 'Bad request - user is already an admin of the organisation'
                            })
                        }
                        else{

                            // check if we already sent the request to join the organisation
                            if(checkUser.O_requests && checkUser.O_requests.includes(org._id)){
                                res.status(400).json({
                                    message: 'Bad request - request already sent'
                                })
                            }
                            else{

                                // send request to join the organisation

                               if(org.requests){
                                org.requests.push(checkUser._id);
                                await org.save();
                                // save the request in the user
                                if(checkUser.O_requests){
                                    checkUser.O_requests.push(org._id);
                                    await checkUser.save();
                                 }
                                    else{
                                        checkUser.O_requests = [org._id];
                                        await checkUser.save();
                                    }
                               }
                                 else{
                                    org.requests = [checkUser._id];
                                    await org.save();
                                     // save the request in the user
                                if(checkUser.O_requests){
                                    checkUser.O_requests.push(org._id);
                                    await checkUser.save();
                                 }
                                    else{
                                        checkUser.O_requests = [org._id];
                                        await checkUser.save();
                                    }
                                 }
                                res.status(200).json({
                                    org,
                                    message: 'Request sent successfully'
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



// accept request to join organisation as admin  route

orgRouter.get('/accept/:id', auth, async (req: any, res: any)=>{
    
    try {

        const user   = req.user;
        const orgId = req.params.id;

        // check if the organisation exists
        const org = await Organisation.findOne({_id: orgId});
        if(!org){
            res.status(401).json({
                message: 'organization not found'
            })

        }
        else{
            // check if the user has request to join the organisation
            if(org.admins &&org.requests && org.requests.includes(user._id)){
                // check if the user is already an admin of the organisation
                
                    // add the user to the admins of the organisation
                    org.admins.push(user._id);
                    await org.save();
                    // add the organisation to the user
                    if(user.organisations){
                        user.organisations.push(org._id);
                        await user.save();
                     }
                        else{
                            user.organisations = [org._id];
                            await user.save();
                        }
                    // delete the user from the requests of the organisation
                    // find the index of the user in the requests array
                    const index = org.requests.indexOf(user._id);
                    // remove the user from the requests array
                    org.requests.splice(index, 1);

                   
                    await org.save();
                    // delete the organisation from the O_requests of the user
                    // find the index of the organisation in the O_requests array
                    const index2 = user.O_requests.indexOf(org._id);
                    // remove the organisation from the O_requests array
                    user.O_requests.splice(index2, 1);
                    await user.save();
                    res.status(200).json({
                        org,
                        message: 'request accepted successfully and user added to the admins of the organisation'
                    })
                
            }
            else{
                res.status(400).json({
                    message: 'Bad request - user is not a authorized to join the organisation'
                })
            }

        }




    } catch (error) {
            
            res.status(500).json({
                message: 'Internal server error',
                error: error
            })
        
    }
    
})


// reject request to join organisation as admin  route

orgRouter.get('/reject/:id', auth, async (req: any, res: any)=>{

    try {
        const user   = req.user;
    const orgId = req.params.id;

    // check if the organisation exists
    const org = await Organisation.findById(orgId);
    if(!org){
        res.status(401).json({
            message: 'organization not found'
        })

    }
    else{
        // check if the user has request to join the organisation
        if(org.admins &&org.requests && org.requests.includes(user._id)){
            // delete the user from the requests of the organisation
            // find the index of the user in the requests array
            const index = org.requests.indexOf(user._id);
            // remove the user from the requests array
            org.requests.splice(index, 1);
            await org.save();
            // delete the organisation from the O_requests of the user
            // find the index of the organisation in the O_requests array
            const index2 = user.O_requests.indexOf(org._id);
            // remove the organisation from the O_requests array
            user.O_requests.splice(index2, 1);
            await user.save();
            res.status(200).json({
                org,
                message: 'request rejected successfully'
            })
        }
        else{
            res.status(400).json({
                message: 'Bad request - user is not a authorized to join the organisation'
            })
        }
    }
        
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        
    }


})

// get all the requests from users to join the organisation

orgRouter.get('/requests/:id', auth, async (req: any, res: any)=>{
    try {
        const user   = req.user;
        const orgId = req.params.id;
    
        // check if the organisation exists
        const org = await Organisation.findById(orgId);
        if(!org){
            res.status(401).json({
                message: 'organization not found'
            })
    
        }
        else{
            // check if the user is an admin of the organisation
            if(org.admins && org.admins.includes(user._id)){
                // get the requests from the organisation
                const requests = await User.find({_id: {$in: org.requests}});
                res.status(200).json({
                    requests
                })
            }
            else{
                res.status(400).json({
                    message: 'Bad request - user is not a authorized to view the requests'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        
    }
}
)


// get all the admins of the organisation
orgRouter.get('/admins/:id', auth, async (req: any, res: any)=>{
    try {
        const user   = req.user;
        const orgId = req.params.id;
        // check if the organisation exists
        const org = await Organisation.findById(orgId);  
        if(!org){
            res.status(401).json({
                message: 'organization not found'
            })
    
        }   
        else{
            // check if the user is an admin of the organisation
            if(org.admins && org.admins.includes(user._id)){
                // get the admins from the organisation
                const admins = await User.find({_id: {$in: org.admins}});
                res.status(200).json({
                    admins
                })
            }
            else{
                res.status(400).json({
                    message: 'Bad request - user is not a authorized to view the admins'
                })
            }
        }


    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        
    }

})




export default orgRouter;