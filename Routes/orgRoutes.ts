import express from 'express';
import { Request, Response } from 'express';
import {User, IUser} from '../Models/User';
import {Organisation, IOrganisation} from '../Models/Organisation';
import {auth} from '../Middlewares/auth';
import { IGetUserAuthInfoRequest } from '../definition';
const orgRouter: express.Router = express.Router();


// create organisation route

orgRouter.post('/create', auth, async (req: IGetUserAuthInfoRequest, res: Response)=>{
    try {
        const {name} = req.body;
        if(!name){
            res.status(400).json({
                message: 'Bad request'
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
                    admins : [user._id]
                });
                await newOrg.save();
                user.organisations.push(newOrg._id);
                await user.save();  
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

orgRouter.get('/all', auth, async (req: IGetUserAuthInfoRequest, res: Response)=>{
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




export default orgRouter;