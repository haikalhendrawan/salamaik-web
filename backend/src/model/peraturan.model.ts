/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

 import pool from "../config/db";
 import "dotenv/config"; 
 // -------------------------------------------------
 export interface PeraturanType{
   id: number;
   nomor: string;
   hal: string;
   tahun: number;
   deleted: string;
   file: string;
 };
 // ------------------------------------------------------
 class Peraturan{
   async getAll(): Promise<PeraturanType[]>{
     try{
       const q = "SELECT * FROM peraturan_ref WHERE deleted IS NULL ORDER BY tahun DESC";
       const result = await pool.query(q);
       return result.rows;
     }catch(err){
       throw err;
     }
   }
 
   async getById(id: number){
     try{
       const q = "SELECT * FROM peraturan_ref WHERE id = $1 AND deleted IS NULL";
       const result = await pool.query(q, [id]);;
       return result.rows;
     }catch(err){
       throw err;
     }
   }
 
   async add(nomor: string, hal: string, tahun: number){
     try{
       const q = "INSERT INTO peraturan_ref (nomor, hal, tahun) VALUES ($1, $2, $3) RETURNING *";
       const result = await pool.query(q, [nomor, hal, tahun]);
       return result.rows[0]
     }catch(err){
       throw err;
     }
   }
 
   async edit(id: number, nomor: string, hal: string, tahun: number){
     try{
       const file = `peraturan${id}.pdf`
       const q = "UPDATE peraturan_ref SET nomor = $1, hal = $2, tahun = $3, file = $4 WHERE id = $5 RETURNING *";
       const result = await pool.query(q, [nomor, hal, tahun, file, id]);
       return result.rows[0]
     }catch(err){
       throw err;
     }
   }
 
   async deleteById(id: number){
     try{
       const q = "UPDATE peraturan_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *";
       const result = await pool.query(q, [id]);
       return result.rows[0];
     }catch(err){
       throw err;
     }
   }
 }
 
 const peraturan = new Peraturan();
 
 
 export default peraturan;