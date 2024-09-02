import pool from '../config/db';
import ErrorDetail from './error.model';
import "dotenv/config"; 

interface ActivityRefType{
  id: number,
  name: string, 
  description: string | null,
  cluster: number
}

interface ActivityJunctionType{
  id: number,
  activity_id: number,
  user_id: string,
  timestamp: string,
  ip: string,
  detail: string | null
}

interface ActivityJoinType{
  id: number,
  activity_id: number,
  name: string,
  description: string | null,
  user_id: string,
  timestamp: string,
  ip: string,
  detail: string | null
}

class Activity{
  async getAllActivityLimited(){
    try{
      const q = ` SELECT activity_junction.*, activity_ref.name AS activity_name, activity_ref.description, activity_ref.cluster, user_ref.name AS user_name
                  FROM activity_junction
                  INNER JOIN activity_ref
                  ON activity_junction.activity_id = activity_ref.id
                  INNER JOIN user_ref
                  ON activity_junction.user_id = user_ref.username
                  WHERE user_id  ${process.env.ADMIN_NIP ? '<> $1' : 'IS NOT NULL'}
                  ORDER BY id DESC
                  LIMIT 7000`;
      const result = await pool.query(q, [process.env.ADMIN_NIP]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getActivityByType(type: number){
    try{
      const q = ` SELECT activity_junction.*, activity_ref.name, activity_ref.description
                  FROM activity_junction
                  INNER JOIN activity_ref
                  ON activity_junction.activity_id = activity_ref.id 
                  WHERE activity_junction.type = $1 
                  ORDER BY id ASC`;
      const result = await pool.query(q, [type]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getActivityByUser(userId: string){
    try{
      const q = ` SELECT activity_junction.*, activity_ref.name, activity_ref.description 
                  FROM activity_junction
                  INNER JOIN activity_ref
                  ON activity_junction.activity_id = activity_ref.id 
                  WHERE activity_junction.user_id = $1 
                  ORDER BY id ASC`;
      const result = await pool.query(q, [userId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getActivityByCluster(cluster: number){
    try{
      const q = `SELECT activity_junction.*, activity_ref.name, activity_ref.description 
                 FROM activity_junction
                 INNER JOIN activity_ref
                 ON activity_junction.activity_id = activity_ref.id 
                 WHERE activity_ref.cluster = $1 
                 ORDER BY id ASC`;
      const result = await pool.query(q, [cluster]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async createActivity(userId: string, type: number, ip: string, detail: string|number|null = null){
    try{
      const q = `INSERT INTO activity_junction (activity_id, user_id, ip, detail) VALUES ($1, $2, $3, $4) RETURNING *`;
      const result = await pool.query(q, [type, userId, ip, detail]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async deleteActivity(id: number){
    try{
      const q = `DELETE FROM activity_junction WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [id]);
      return result.rows
    }catch(err){
      throw err
    }
  }
}

const activity = new Activity();

export default activity