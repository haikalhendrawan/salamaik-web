import {Request, Response, NextFunction} from 'express';
import profile from '../model/profile.model';
import multer from 'multer';
import {uploadPP} from '../config/multer';
import ErrorDetail from '../model/error.model';
// -------------------------------------------------

// ------------------------------------------------------
const updateCommonProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.payload.id;
    const { name, username, email, period } = req.body;
    const response = await profile.updateCommonProfile(userID, name, username, email, period );
    return res.status(200).json({sucess: true, message: 'Profile has been updated'});
  } catch (err) {
    next(err);
  }
}

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.payload.id;
    const { oldPassword, newPassword } = req.body;
    const response = await profile.updatePassword(userID, oldPassword, newPassword );
    return res.status(200).json({sucess: true, message: 'Password has been updated'});
  } catch (err) {
    next(err);
  }
}

const updateProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  uploadPP(req, res, async (err: any) => {
    if(err instanceof multer.MulterError) {
      if(err.message==='LIMIT FILE SIZE'){
        return next(new ErrorDetail(400, 'File size is too large max 12mb'));
      }else{
        return next(err);
      }
    } else if(err) {
      return next(err);
    };

    if(!req.file){
      return next(new ErrorDetail(400, 'Incorrect file type', err));
    };



    try {
      const userID = req.payload.id;
      const nip = req.payload.username;
      const fileExt = req.file.mimetype.split("/")[1];
      const fileName =`avatar_${nip}.${fileExt}`;
      const response = await profile.updateProfilePicture(userID, fileName);
      return res.status(200).json({ success: true, message: 'Profile picture has been updated' });
    } catch (err) {
      next(err);
    }
  });
}


export { updateCommonProfile, updatePassword, updateProfilePicture}