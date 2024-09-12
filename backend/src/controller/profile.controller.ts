/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import profile from '../model/profile.model';
import multer from 'multer';
import {uploadPP} from '../config/multer';
import ErrorDetail from '../model/error.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
import { passwordSchema, emailSchema } from '../utils/schema';
// -------------------------------------------------

// ------------------------------------------------------
const updateCommonProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nip = req.payload.username;
    const ip = req.ip || '';

    const userId = req.payload.id;
    const { name, username, email, period } = req.body;

    if(name.length === 0 || !name){
      throw new ErrorDetail(400, 'Name cannot be empty')
    };

    if(username.length !== 18 || !username){
      throw new ErrorDetail(400, 'NIP must be 18 digits')
    };

    if(!(emailSchema.safeParse(email).success)){
      throw new ErrorDetail(400, 'Invalid email')
    };

    const response = await profile.updateCommonProfile(userId, name, username, email, period );

    nonBlockingCall(activity.createActivity(nip, 51, ip, username));

    return res.status(200).json({sucess: true, message: 'Profile has been updated', detail: response});
  } catch (err) {
    next(err);
  }
}

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nip = req.payload.username;
    const ip = req.ip || '';

    const userId = req.payload.id;
    const { oldPassword, newPassword } = req.body;
    const validPassword = passwordSchema.safeParse(newPassword);

    if(!(validPassword.success)){
      return next(new ErrorDetail(400,'Password criteria is not fulfilled'))
    };

    const response = await profile.updatePassword(userId, oldPassword, newPassword );

    nonBlockingCall(activity.createActivity(nip, 52, ip, userId));

    return res.status(200).json({sucess: true, message: 'Password has been updated', detail: response});
  } catch (err) {
    next(err);
  }
}

const updateProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  uploadPP(req, res, async (err: any) => {
    if(err instanceof multer.MulterError) {
      return next(new ErrorDetail(400, 'File too large (Max 2mb)', err));
    } else if(err) {
      return next(err);
    };

    if(!req.file){
      return next(new ErrorDetail(400, 'Incorrect file type', err));
    };

    try {
      const ip = req.ip || '';

      const userID = req.payload.id;
      const nip = req.payload.username;
      const fileExt = req.file.mimetype.split("/")[1];
      const fileName =`avatar_${nip}.${fileExt}`;
      const response = await profile.updateProfilePicture(userID, fileName);

      nonBlockingCall(activity.createActivity(nip, 53, ip, fileName));

      return res.status(200).json({ success: true, message: 'Profile picture has been updated', rows: response });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
}


export { updateCommonProfile, updatePassword, updateProfilePicture}