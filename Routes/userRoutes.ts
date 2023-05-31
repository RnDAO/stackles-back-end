import express, {CookieOptions} from 'express';
import { Request, Response } from 'express';
import {User, IUser} from '../Models/User';
import { auth } from '../Middlewares/auth';

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
                const options : CookieOptions = {
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    httpOnly: true,
                    secure: false,
                    // sameSite: "none",
                    // path: "/",
                    // domain: "https://stackels.vercel.app"
                    domain : "https://stackels.vercel.app"

                }; // 30 days
                res.status(200).cookie('token', token, options).json({
                newUser,
                token,
                message: 'user created and login successful'
                })
            }
            else{
                const token = await user.generateAuthToken();
                const options : CookieOptions = {
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    httpOnly: true,
                    secure: false,
                    // sameSite: "none",
                    // path: "/",
                    // domain: "https://stackels.vercel.app"

                }; // 30 days
                res.status(200).cookie('token', token, options).json({
                user,
                token,
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


// check if the user exists or not
userRouter.post('/check', async (req: Request, res: Response)=>{
    try {
        const {email} = req.body;
        if(!email){
            res.status(400).json({
                message: 'Bad request'
            })
        }else{
            const user = await User.find({email: email});
            // console.log(user);
            if(user.length > 0){
                res.status(200).json({
                    message: 'User exists',
                    user: user
                })
            }else{
                res.status(200).json({
                    message: 'User does not exist',
                    // user: user
                })
            }

        }
        
    } catch (error) {
        
    }

})


// get all organisations of a user
userRouter.get('/all/org', auth, async (req: any, res: Response)=>{

    const user = req.user;
    try {
        const organisations = await User.findById(user._id).populate('organisations');
        res.status(200).json({
            organisations
        })
    }
    catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
    }


})

// get all collections of a user
userRouter.get('/all/coll', auth, async (req: any, res: Response)=>{
    const user = req.user;
    try {
        const collections = await User.findById(user._id).populate('collections');
        res.status(200).json({
            collections
        })
    }
    catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
    }
}
)

// get all O_requests of a user
userRouter.get('/all/org/requests', auth, async (req: any, res: Response)=>{
    const user = req.user;
    try {
        const requests = await User.findById(user._id).populate('O_requests');
        res.status(200).json({
            requests
        })
    }
    catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
    }
}
)


// get all links of a user
userRouter.get('/links/all', auth, async (req: any, res: Response)=>{

    try {

        const user = req.user;
        const links = await User.findById(user._id).populate('links');
        const actual = links?.links;
        if(!actual){
            return res.status(404).json({
                message: 'Links not found'
            })
        }
        
        res.status(200).json({
            message : 'Links fetched successfully',
            links: actual
        })


        
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })

    }


})


// get all details of a user by populating all the fields
userRouter.get('/all/details', auth, async (req: any, res: Response)=>{

    try {
        const user = req.user;
        // populate organisations, collections, and links
        const details = await User.findById(user._id).populate('organisations').populate('collections').populate('links');
        res.status(200).json({
            message: 'Details fetched successfully',
            details
        })

        
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        
    }

})



export default userRouter;