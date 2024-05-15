import {Request, Response, NextFunction} from 'express';
import unit from '../model/unit.model';
// -------------------------------------------------
interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  interval: number
};
// ------------------------------------------------------
const getAllStandardization = async (req: Request, res: Response, next: NextFunction) => {
 
}

const getUnitById = async (req: Request, res: Response, next: NextFunction) => {
  
}

export { }