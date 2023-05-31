import express, { NextFunction, Request, Response } from 'express';
import {User, IUser} from '../Models/User';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../definition';


// interface AuthenticatedRequest extends Request {
//   user: IUser | null | undefined;
// }



const JWT_SECRET = "alwaysnoteverything";
const auth = async (req : any, res: any, next: any)=>{

  
  try {
    res.setHeader('Access-Control-Allow-Origin', 'https://stackels.vercel.app'); // Replace with the origin of your frontend application
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, headers) to be sent with requests
      // console.log(req.cookies);
      const token = req.cookies.token;
      // console.log(token);
      if(!token){
          res.status(401).json({
              message: 'Unauthorized - no token'
          })
      }
      else{
        const decoded : any = jwt.verify(token, JWT_SECRET);
        const email: string   = decoded.email;
        // console.log(decoded);
        // console.log(email);
        if(email){
          // find user by email 
          const user = await User.findOne({email: email});
          // console.log(user);
          if(user){
            req.user = user;
          }
          else{
            res.status(401).json({
              message: 'Unauthorized - no user found'
            })
          }
        }

        next();
      }

     } catch (error) {
          res.status(500).json({
              message: 'Internal server error - auth middleware',
              error: error
          })
      
     }

}



export  {auth};