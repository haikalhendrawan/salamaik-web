/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------
export interface KomponenType{
  id: number,
  title: string,
  bobot: number,
  detail: string | null,
  alias: string,
  peraturan: number,
  deleted: string | null,
};

export interface SubKomponenType{
  id: number,
  title: string,
  komponen_id: number,
  detail: string | null,
  deleted: string | null,
};

export interface SubSubKomponenType{
  id: number;
  komponen_id: number;
  subkomponen_id: number;
  title: number;
  detail: string | null;
  deleted: string | null;
}

export interface KomponenWithSubKomponen{
  id: number,
  title: string,
  bobot: number,
  detail: string | null,
  alias: string,
  deleted: string | null,
  subkomponen: SubKomponenType[]
}
// ------------------------------------------------------
class Komponen{
  async getAllKomponen(peraturan: number){
    try{
      const q = "SELECT * FROM komponen_ref WHERE deleted IS NULL AND peraturan = $1 ORDER BY id ASC";
      const result = await pool.query(q, [peraturan]);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getAllKomponenExisting(){
    try{
      const q = "SELECT * FROM komponen_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getAllKomponenWithSubKomponen(peraturan: number): Promise<KomponenWithSubKomponen[]>{
    try{
      const q = ` SELECT komponen_ref.*, json_agg(subkomponen_ref.* ORDER BY subkomponen_ref.id ASC) AS subkomponen 
                  FROM komponen_ref 
                  INNER JOIN subkomponen_ref ON komponen_ref.id = subkomponen_ref.komponen_id 
                  WHERE komponen_ref.deleted IS NULL
                  AND komponen_ref.peraturan = $1
                  AND subkomponen_ref.deleted IS NULL
                  GROUP BY komponen_ref.id
                  ORDER BY komponen_ref.id ASC`;
      const result = await pool.query(q, [peraturan]);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async createKomponen(form: Omit<KomponenType, 'id'>){
    try{
      const {title, bobot, detail, alias, peraturan} = form;
      const q = "INSERT INTO komponen_ref (title, bobot, detail, alias, deleted, peraturan) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
      const result = await pool.query(q, [title, bobot, detail, alias, null, peraturan]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async deleteKomponen(id: number){
    try{
      const q = "UPDATE komponen_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async editKomponen(form: {id: number, title: string, bobot: number, alias: string}){
    try{
      const {id, title, bobot,alias} = form;
      const q = "UPDATE komponen_ref SET title = $2, bobot = $3, alias = $4 WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id, title, bobot, alias]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }
}

const komponen = new Komponen();

class SubKomponen{
  async getAllSubKomponen(peraturan: number){
    try{
      const q = ` SELECT subkomponen_ref.* FROM subkomponen_ref
                  INNER JOIN komponen_ref ON subkomponen_ref.komponen_id = komponen_ref.id 
                  WHERE subkomponen_ref.deleted IS NULL
                    AND komponen_ref.peraturan = $1 
                  ORDER BY subkomponen_ref.id ASC`;
      const result = await pool.query(q, [peraturan]);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getAllSubKomponenExisting(){
    try{
      const q = "SELECT * FROM subkomponen_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async createSubKomponen(form: Omit<SubKomponenType, 'id'>){
    try{
      const {title, komponen_id, detail} = form;
      const q = "INSERT INTO subkomponen_ref (title, komponen_id, detail, deleted) VALUES ($1, $2, $3, $4) RETURNING *";
      const result = await pool.query(q, [title, komponen_id, detail, null]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async deleteSubKomponen(id: number){
    try{
      const q = "UPDATE subkomponen_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async editSubKomponen(form: Omit<SubKomponenType, 'deleted'>){
    try{
      const {id, title, komponen_id, detail} = form;
      const q = "UPDATE subkomponen_ref SET title = $2, komponen_id = $3, detail = $4 WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id, title, komponen_id, detail]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }
}

const subKomponen = new SubKomponen();

class SubSubKomponen{
  async getAllSubSubKomponen(peraturan: number){
    try{
      const q = ` SELECT subsubkomponen_ref.* FROM subsubkomponen_ref
                  INNER JOIN komponen_ref ON subsubkomponen_ref.komponen_id = komponen_ref.id 
                  WHERE subsubkomponen_ref.deleted IS NULL 
                    AND komponen_ref.peraturan = $1
                  ORDER BY subsubkomponen_ref.id ASC`;
      const result = await pool.query(q, [peraturan]);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getAllSubSubKomponenExisting(){
    try{
      const q = "SELECT * FROM subsubkomponen_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async createSubSubKomponen(form: Omit<SubSubKomponenType, 'id'>){
    try{
      const {title, komponen_id, subkomponen_id, detail} = form;
      const q = "INSERT INTO subsubkomponen_ref (title, komponen_id, subkomponen_id, detail, deleted) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const result = await pool.query(q, [title, komponen_id,subkomponen_id, detail, null]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async deleteSubSubKomponen(id: number){
    try{
      const q = "UPDATE subsubkomponen_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async editSubSubKomponen(form: Omit<SubSubKomponenType, 'deleted'>){
    try{
      const {id, title, komponen_id, subkomponen_id, detail} = form;
      const q = "UPDATE subsubkomponen_ref SET title = $2, komponen_id = $3, subkomponen_id = $4, detail = $5 WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id, title, komponen_id, subkomponen_id, detail]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }
}

const subSubKomponen = new SubSubKomponen();


export {komponen, subKomponen, subSubKomponen};

