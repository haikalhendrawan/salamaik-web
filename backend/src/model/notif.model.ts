import pool from "../config/db";

/**
 *
 *
 * @class Notif
 * @method getNotif [get seluruh referensi notification] => return notif[]
 * @method getNotifById [get seluruh notification per user] => return notif_junction[]
 * @method addNotif [create referensi notification baru] => return void
 * @method assignNotif [assign notification ke user] => return void
 * @method updateNotif [update status notification to read] => return void
 */

class Notif{

  async getNotif(){
    try{
      const q = "SELECT * FROM notif ORDER BY id DESC";
      const result = await pool.query(q);
      return result.rows
    }catch(err){
      return err
    }
  }

  async getNotifById(id: string){
    try{
      const q = ` SELECT notif_junction.*, notif.message, notif.title, notif.created_at, notif.categories
                  FROM notif_junction
                  INNER JOIN notif
                  ON notif_junction.notif_id = notif.id 
                  WHERE receiver_id = $1
                  ORDER BY notif_junction.junction_id DESC`;
      const result = await pool.query(q, [id]);
      return result.rows
    }catch(err){
      return err
    }
  } 

  async addNotif(title: string, message: string, categories: number, creatorID: string){
    try{
      const q = ` INSERT INTO notif (title, message, categories, created_by) 
                  VALUES ($1, $2, $3, $4) 
                  RETURNING *`;
      const result = await pool.query(q, [title, message, categories, creatorID]);
      return result.rows[0]
    }catch(err){
      return err
    }
  }

  async assignNotif(userID: string, notifID: number){
    const client = await pool.connect();

    try{
      await client.query('BEGIN');
      const q1 = `SELECT id FROM user_ref`;
      const result1 = await pool.query(q1);
      const allUser = result1.rows;

      const response  = await Promise.all(allUser.map(async (receiverID: {id: string}) => {
        const q2 = `INSERT INTO notif_junction (notif_id, creator_id, receiver_id) 
                    VALUES ($1, $2, $3) 
                    RETURNING *`;
        const result2 = await client.query(q2, [notifID, userID, receiverID.id]);
        return result2.rows[0]
      }));

      const q3 = `UPDATE notif SET published = $1 WHERE id = $2`;
      await pool.query(q3, [1, notifID]);

      await client.query('COMMIT');
      return response
    }catch(err){
      await client.query('ROLLBACK');
      return err
    }finally{
      client.release();
    }
  } 

  async updateNotif(userID: string, notifJunctionID: number){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = ` UPDATE notif_junction
                  SET status = $1, completed_at = $2
                  WHERE junction_id = $3 AND receiver_id = $4
                  RETURNING *`;
      const result = await pool.query(q, [1, updateTime, notifJunctionID, userID]);
      return result.rows[0]
    }catch(err){
      console.log(err);
      return err
    }
  }

  async deleteNotif(notifID: number){
    try{
      const q = ` DELETE FROM notif WHERE id = $1 `;
      const result = await pool.query(q, [notifID]);
      return result.rows[0]
    }catch(err){
      console.log(err);
      return err
    }
  }
}

const notif = new Notif();

export default notif