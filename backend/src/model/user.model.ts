/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import bcrypt from "bcrypt";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
/**
 *
 *
 * @class User
 * manajemen user oleh admin aplikasi
 * @method updateCommonProfile update data basic user => return void
 * @method updatePassword update data password user => return void
 * @method updateProfilePicture update pp user => return void
 */

interface AddUserBodyType{
  id: string,
  username: string;
  name: string;
  email: string;
  password_hash: string;
  picture: string;
  period: number;
  role: number;
  status: number;
  kppn: string;
  gender: number;
}
interface EditUserBodyType{
  id: string,
  username: string,
  name: string,
  email: string,
  period: number,
  role: number,
  status: number,
  kppn: string,
  gender: number
}

export interface UserType{
  id: string,
  username: string;
  name: string;
  email: string;
  picture: string;
  period: number;
  role: number;
  status: number;
  kppn: string;
  gender: number;
  created_at: Date;
}

class User{
  async getAllUser(): Promise<UserType[] | []>{
    try{
      const q = ` SELECT id, username, name, email, picture, period, role, status, kppn, gender, created_at 
                  FROM user_ref`;
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getUserKPPN(kppn: string): Promise<UserType[] | []>{
    try{
      const q = ` SELECT id, username, name, email, picture, period, role, status, kppn, gender, created_at
                  FROM user_ref 
                  WHERE kppn = $1`;
      const result = await pool.query(q, [kppn]);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getAllUserWtAdmin(): Promise<UserType[] | []> {
    try{
      const q = ` SELECT id, username, name, email, picture, period, role, status, kppn, gender, created_at
                  FROM user_ref
                  WHERE role != 99`;
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getUserById(id: string){
    try{
      const q = `SELECT * FROM user_ref WHERE id = $1`;
      const result = await pool.query(q, [id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async addUser(body: AddUserBodyType){
    try{
      const {id, username, name, email, password_hash, picture, period, role, status, kppn, gender} = body;
      const q = `INSERT 
                INTO user_ref (
                  id,
                  username, 
                  name, email, 
                  password_hash, 
                  picture, 
                  period, 
                  role, 
                  status, 
                  kppn, 
                  gender
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                RETURNING *`;
      const result = await pool.query(q, [id, username, name, email, password_hash, picture, period, role, status, kppn, gender]);
      return result.rows[0]
    }catch(err){
      throw err;
    }
  }

  async editUser(body: EditUserBodyType){
    try{
      const {id, username, name, email, kppn, gender} = body;
      const q = ` UPDATE user_ref 
                  SET 
                    username = $1, 
                    name = $2, 
                    email = $3,
                    kppn = $4, 
                    gender = $5 
                  WHERE id = $6 
                  RETURNING *`;
      const result = await pool.query(q, [username, name, email, kppn, gender, id]);
      return result.rows[0]
    }catch(err: any){
      if(err.code === '23505'){
        throw new ErrorDetail(400, 'NIP has been taken', err.detail)
      };
      throw err
    }
  }

  async deleteUser(targetID: string){
    try{
     const q = `DELETE FROM user_ref WHERE id = $1 RETURNING *`;
     const result = await pool.query(q, [targetID]);
     return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async checkUsername(username: string){
    try{
      const q = "SELECT * FROM user_ref WHERE username = $1 AND status = 1";
      const result = await pool.query(q, [username]);

      if(result.rows.length > 0){
        return false
      }else{
        return true
      }
    }catch(err){
      return false
    }
  }

  async checkEmail(email: string){
    try{
      const q = "SELECT * FROM user_ref WHERE email = $1";
      const result = await pool.query(q, [email]);

      if(result.rows.length > 0){
        return false
      }else{
        return true
      }
    }catch(err){
      return false
    }
  }

  async updateStatus(targetID: string){
    try{
      const q = `UPDATE user_ref SET status = 1 WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [targetID]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async demoteStatus(targetID: string){
    try{
      const q = `UPDATE user_ref SET status = 0 WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [targetID]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async updateRole(id: string, newRole: number){
    try{
      const q = `UPDATE user_ref SET role = $1 WHERE id = $2 RETURNING *`;
      const result = await pool.query(q, [newRole, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }



}

const user = new User();


export default user;
