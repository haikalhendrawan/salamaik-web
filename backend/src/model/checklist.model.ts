import pool from "../config/db";

interface ChecklistType{
  id: number,
  title: string, 
  header: string,
  komponen_id: number,
  subkomponen_id: number,
  subsubkomponen_id: number,
  standardisasi: number, 
  matrix_title: string, 
  file1: string,
  file2: string
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};


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

  async editChecklistFile(id: number, filename: string, option: number){
    try{
      const q = option===1
                ?"UPDATE checklist_ref SET file1 = $1 WHERE id = $2 RETURNING *"
                :"UPDATE checklist_ref SET file2 = $1 WHERE id = $2 RETURNING *";
      const result = await pool.query(q, [filename, id]);
      return result;
    }catch(err){
      throw err;
    }
  }

  async deleteChecklistFile(id: number, option: number){
    try{
      const q = option===1
                ?"UPDATE checklist_ref SET file1 = NULL WHERE id = $1 RETURNING *"
                :"UPDATE checklist_ref SET file2 = NULL WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result;
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