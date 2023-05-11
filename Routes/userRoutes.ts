import express from 'express';
import { Request, Response } from 'express';
import {User, IUser} from '../Models/User';
const userRouter: express.Router = express.Router();



// login route
userRouter.post('/login',async (req: Request, res: Response)=>{
    
    
   try {
        const {email, name} = req.body;
        if(!email || !name){
            res.status(400).json({
                message: 'Bad request'
            })
        }else{
            const user : any  = await User.findOne({email: email});
            if(!user){
                const newUser = new User({
                    name: name,
                    email: email
                });
                await newUser.save();
                const token = await newUser.generateAuthToken();
                const options = {expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), httpOnly: true};
                res.status(200).cookie('token', token, options).json({
                newUser,
                message: 'user created and login successful'
                })
            }
            else{
                const token = await user.generateAuthToken();
                const options = {expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), httpOnly: true};
                res.status(200).cookie('token', token, options).json({
                user,
                message: 'Login successful'
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


// logout route
userRouter.get('/logout', async (req: Request, res: Response)=>{

    try {
        
        res.status(200).clearCookie('token').json({
            message: 'Logout successful'
        })



    } catch (error) {
        
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })

    }

})






export default userRouter;