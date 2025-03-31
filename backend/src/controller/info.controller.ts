/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import worksheet, { WorksheetType } from '../model/worksheet.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
import { getScoreProgressResponseBody } from './worksheetJunction.controller';
import findings from '../model/findings.model';
import ErrorDetail from '../model/error.model';
import wsJunction, {WsJunctionJoinChecklistType} from '../model/worksheetJunction.model';
import { FindingsUtil } from '../utils/businessLogic/findings.utils';
import user, { UserType } from '../model/user.model';
import { ActivityJoinUserType } from '../model/activity.model';

// ------------------------------------------------------------------------------------------------------------
const getByKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const kppn = req.payload.kppn;
    const period = req.payload.period;

    const ws = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const openPeriod = ws?.[0]?.open_period;
    const closePeriod = ws?.[0]?.close_period;
    const openFollowUp = ws?.[0]?.open_follow_up;
    const closeFollowUp = ws?.[0]?.close_follow_up;

    const comprehensiveFindings = await findings.getComprehensiveByKPPNPeriod(kppn, period);
    const findingsCount = FindingsUtil.getAmount(comprehensiveFindings);
    const isFinal = FindingsUtil.isFinal(comprehensiveFindings);

    if(!ws || ws.length === 0) {
      throw new ErrorDetail(404, 'Worksheet not found')
    };
    
    const wsDetail = await getScoreProgressResponseBody(ws, true);

    const users = await user.getAllUserWtAdmin();
    const userFromReference = getInvolvedUserFromList(users, kppn, closePeriod.toISOString());

    const wsJunctionDetail = await wsJunction.getWsJunctionByWorksheetId(ws[0].id);
    const wsActivity = await activity.getByTypeDates([85, 91], new Date(openPeriod), new Date(closePeriod));
    const usersFromActivity = getInvolvedUserFromWsJunction(wsActivity, wsJunctionDetail);

    const isAfter2025 = new Date(openPeriod) > new Date('2025-01-01');
  
    const output = {
      score: wsDetail.scoreByKanwil || null,
      findings: findingsCount,
      isFinal,
      openPeriod,
      closePeriod,
      openFollowUp,
      closeFollowUp,
      users: isAfter2025 ? usersFromActivity : userFromReference,
    };

    nonBlockingCall(activity.createActivity(username, 82, ip));

    return res.status(200).json(output);
  }catch(err){
    next(err)
  }
};

export {
  getByKPPN
}

// ------------------------------------------------------------------------------------------------------------
interface SimpleUser{
  name: string,
  nip: string,
  kppn: string,
  picture: string
}

function getInvolvedUserFromList(users: UserType[], kppn: string, closePeriod: string) {
  return users
          .filter((item) => 
            new Date(item.created_at) < new Date('2025-01-01') // date when worksheet activity log is fixed
            && new Date(item.created_at) < new Date(closePeriod)
            && (item.kppn === kppn || item.kppn.length === 5))
          .map((item) => ({
            nip: item.username,
            name: item.name,
            kppn: item.kppn,
            picture: item.picture
          }));
} 

function getInvolvedUserFromWsJunction(wsActivity: ActivityJoinUserType[], wsJunctionDetail: WsJunctionJoinChecklistType[]){
  const junctionIds = wsJunctionDetail.map((item) => item.junction_id);

  const uniqueIds: number[] = [];
  junctionIds.forEach((item) => uniqueIds.includes(item) ? null : uniqueIds.push(item));

  const userFromActivity = wsActivity.filter((item) => uniqueIds.includes(item.detail?.junction_id)).map((item) =>({
    nip: item.nip,
    name: item.user_name,
    kppn: item.kppn,
    picture: item.picture
  }));

  const uniqueNIP: string[] = [];
  const uniqueUsers: SimpleUser[]  = [];

  userFromActivity.forEach((item) => {
    if(uniqueNIP.includes(item.nip)) {
      return
    }
    uniqueNIP.push(item.nip);
    uniqueUsers.push(item);
  });

  return uniqueUsers;

}