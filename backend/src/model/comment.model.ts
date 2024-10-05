/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import { PoolClient } from "pg";
// --------------------------------------------------------------------------------------
export interface CommentType{
  id: number
  ws_junction_id: number
  user_id: string
  comment: string
  created_at: string
  active: number
  name: string
  avatar: string | null
}

// --------------------------------------------------------------------------------------
class Comment {
  async getByWsJunctionId(wsJunctionId: string, poolTrx?: PoolClient) {
    const poolInstance = poolTrx ?? pool;

    try{
      const q = ` SELECT comment_data.*, user_ref.name, user_ref.picture 
                  FROM comment_data
                  LEFT JOIN user_ref
                  ON comment_data.user_id = user_ref.id
                  WHERE ws_junction_id = $1
                `;
      const result = await poolInstance.query(q, [wsJunctionId]);

      return result.rows
    }catch(err){
      throw err
    }
 }

 async add(wsJunctionId: string, userId: string, comment: string, poolTrx?: PoolClient) {
  const poolInstance = poolTrx ?? pool;

  try{
    const q = ` INSERT INTO comment_data (ws_junction_id, user_id, comment, active) 
                VALUES ($1, $2, $3) 
                RETURNING *
              `;
    const result = await poolInstance.query(q, [wsJunctionId, userId, comment, 1]);
    return result.rows[0]
  }catch(err){
    throw err
  }
   
 }
}

const comment = new Comment();

export default comment