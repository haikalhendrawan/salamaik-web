import pool from "../config/db";
import bcrypt from "bcrypt";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
/**
 *
 *
 * @class Profile
 * utk handle perubahan data profil umum, digunakan oleh user biasa
 * handle perubahan data rinci seperti role, unit,  dll. berada pada user service dan hanya diakses oleh admin
 * @method updateCommonProfile update data basic user => return void
 * @method updatePassword update data password user => return void
 * @method updateProfilePicture update pp user => return void
 */
class Profile{
  async updateCommonProfile(id: string, name: string, username: string, email: string, period: number){
    try{
      const q = "UPDATE user_ref SET name = $1, username = $2, email = $3, period = $4 WHERE id = $5 RETURNING *";
      const result = await pool.query(q, [name, username, email, period, id]);
      return result
    }catch(err){
      throw err
    }
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string){
    const client = await pool.connect();

    try{
      await client.query("BEGIN");
      const q1 = "SELECT password_hash FROM user_ref WHERE id = $1";
      const result1 = await client.query(q1, [id]);
      const hashedPassword = result1.rows[0].password_hash;
      const isMatch = await bcrypt.compare(oldPassword, hashedPassword);

      if(!isMatch){
        throw new ErrorDetail(403, "Incorrect old password")
      };

      const q2 = "UPDATE user_ref SET password_hash = $1 WHERE id = $2 RETURNING *";
      const newPasswordHashed = await bcrypt.hash(newPassword, 10);
      const result2 = await client.query(q2, [newPasswordHashed, id]);
      await client.query("COMMIT");
      
      return result2
    }catch(err){
      throw err
    }
  }

  async updateProfilePicture(id: string, picture: string){
    try{
      const q = "UPDATE user_ref SET picture = $1 WHERE id = $2 RETURNING *";
      const result = await pool.query(q, [picture, id]);
      return result
    }catch(err){
      throw err
    }
  }

}

const profile = new Profile();


export default profile;