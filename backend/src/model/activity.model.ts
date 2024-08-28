import pool from '../config/db';
import ErrorDetail from './error.model';

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
  timestamp: string
}

interface ActivityJoinType{
  id: number,
  activity_id: number,
  name: string,
  description: string | null,
  user_id: string,
  timestamp: string
}

class Activity{
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

  async createActivity(userId: string, type: number){
    try{
      const q = `INSERT INTO activity_junction (activity_id, user_id) VALUES ($1, $2) RETURNING *`;
      const result = await pool.query(q, [type, userId]);
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