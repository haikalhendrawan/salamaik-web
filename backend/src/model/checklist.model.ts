import pool from "../config/db";

class Checklist{
  async getAllChecklist(){
    try{
      const q = "SELECT * FROM checklist_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getAllOpsi(){
    try{
      const q = "SELECT * FROM opsi_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const checklist = new Checklist();

export default checklist