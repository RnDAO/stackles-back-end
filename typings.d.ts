// typings.d.ts

import express from 'express';
import { IUser } from './Models/User';

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}
declare module "express" { 
  export interface Request {
    user: any
  }
}

// declare module 'express-serve-static-core' {
//   export interface Request {
//     user: any
//   }
// }
