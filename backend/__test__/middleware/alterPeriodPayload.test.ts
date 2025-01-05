/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { Request, Response, NextFunction } from "express";
import alterPeriodPayload from "../../src/middleware/alterPeriodPayload";
import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import * as roles from '../../src/config/role';


describe("alterPeriodPayload", () => {
  const {superAdmin, adminKanwil, userKanwil, adminKPPN, userKPPN} = roles;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      params: {
      },
      payload: {
        period: 0
      }
    } as any as Request;
    res= {};
    next = jest.fn();
  });

  it('Should not alter period payload if period parameter not provided', () => {
    req.params.period = undefined;

    alterPeriodPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.payload.period).toBe(0);
  });

  const notAllowedRoles = [userKPPN, adminKPPN];
  const allowedRoles = [superAdmin, adminKanwil, userKanwil];

  it.each(notAllowedRoles)('Should not alter period payload if role is not allowed', (role) => {
    req.params.period = 1;
    req.payload.role = role;
    req.payload.period = 0;

    alterPeriodPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.payload.period).toBe(0);
  })

  it.each(allowedRoles)('Should alter period payload if role is allowed', (role) => {
    req.params.period = 1;
    req.payload.role = role;
    req.payload.period = 0;

    alterPeriodPayload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.payload.period).toBe(1);
  })

})