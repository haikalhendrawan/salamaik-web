import {Request, Response, NextFunction} from 'express';
import profile from '../model/profile.model';
// -------------------------------------------------

// ------------------------------------------------------
const updateCommonProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.payload.id;
    const { name, username, email, period } = req.body;
    const response = await profile.updateCommonProfile(userID, name, username, email, period );
    return res.status(200).json({sucess: true, message: 'Profile updated'});
  } catch (err) {
    next(err);
  }
}


export { updateCommonProfile }