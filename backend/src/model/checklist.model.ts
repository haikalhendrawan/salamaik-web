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
  file2: string,
  instruksi: string | null,
  contoh_file: string | null
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};

//-----------------------------------------------------------------------------
class Checklist{
  async getAllChecklist(){
    try{
      const q = "SELECT * FROM checklist_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editChecklist(body: ChecklistType){
    try{
      const {
        id,
        title, 
        header,
        komponen_id,
        subkomponen_id,
        subsubkomponen_id,
        standardisasi, 
        matrix_title, 
        file1,
        file2,
        instruksi,
        contoh_file
      } = body;

      const q = ` UPDATE checklist_ref
                  SET
                    title = $1, 
                    header = $2, 
                    komponen_id = $3, 
                    subkomponen_id = $4, 
                    subsubkomponen_id = $5, 
                    standardisasi = $6, 
                    matrix_title = $7, 
                    file1 = $8, 
                    file2 = $9, 
                    instruksi = $10, 
                    contoh_file = $11
                  WHERE id = $12 
                  RETURNING *`;
      const result = await pool.query(q, [title, header, komponen_id, subkomponen_id, subsubkomponen_id, standardisasi, matrix_title, file1, file2, instruksi, contoh_file, id]);
      return result.rows
    }catch(err){
      throw err
    }

  }

  async editChecklistFile(id: number, filename: string, option: number){
    try{
      const q = option===1
                ?"UPDATE checklist_ref SET file1 = $1 WHERE id = $2 RETURNING *"
                :"UPDATE checklist_ref SET file2 = $1 WHERE id = $2 RETURNING *";
      const result = await pool.query(q, [filename, id]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async deleteChecklistFile(id: number, option: number){
    try{
      const q = option===1
                ?"UPDATE checklist_ref SET file1 = NULL WHERE id = $1 RETURNING *"
                :"UPDATE checklist_ref SET file2 = NULL WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getAllOpsi(){
    try{
      const q = "SELECT * FROM opsi_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editOpsiById(id: number, title: string, value: number, checklistId: number){
    try{
      const q = "UPDATE opsi_ref SET title = $1, value = $2, checklist_id = $3 WHERE id = $4 RETURNING *";
      const result = await pool.query(q, [title, value, checklistId, id]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  //utk integritas kertas kerja, better tidak buat endpoint delete dan add for now (TODO)


}

const checklist = new Checklist();

export default checklist