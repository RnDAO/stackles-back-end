import { Request } from "express"
import { IUser } from "./Models/User"
export interface IGetUserAuthInfoRequest extends Request {
  user : any;
}