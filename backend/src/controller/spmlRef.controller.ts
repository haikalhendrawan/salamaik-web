/**
 * Salamaik API 
 * © Kanwil DJPb Sumbar 2026
 */

import { Request, Response, NextFunction } from 'express';
import { komponenSpml, subKomponenSpml, aspekSpml, checklistSpml } from '../model/spmlRef.model';
import ErrorDetail from '../model/error.model';

// =============================================================================
// 1. KOMPONEN SPML CONTROLLER
// =============================================================================
export const getAllKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { peraturan } = req.payload ?? {};
    const result = await komponenSpml.getAllKomponenSpml(peraturan);
    return res.status(200).json({ success: true, message: 'Get komponen SPML success', rows: result });
  } catch (err) {
    next(err);
  }
};

export const createKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, bobot, alias, detail, urut } = req.body;
    const { peraturan } = req.payload ?? {};

    if (!title) {
      throw new ErrorDetail(400, 'Judul komponen SPML wajib diisi');
    }
    if (bobot !== undefined && bobot !== null && (isNaN(bobot) || bobot < 0 || bobot > 100)) {
      throw new ErrorDetail(400, 'Nilai bobot tidak valid (0-100)');
    }
    if (urut !== undefined && urut !== null && typeof urut !== 'string') {
      throw new ErrorDetail(400, 'Urut komponen SPML harus berupa teks');
    }

    const result = await komponenSpml.createKomponenSpml({
      title,
      bobot: bobot ?? 0,
      alias: alias ?? null,
      detail: detail ?? null,
      peraturan: peraturan ?? 2,
      urut: typeof urut === 'string' && urut.trim() ? urut.trim() : null,
    });

    return res.status(200).json({ success: true, message: 'Komponen SPML created successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const editKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, title, bobot, alias, detail, urut } = req.body;
    if (!id) {
      throw new ErrorDetail(400, 'ID komponen SPML wajib diisi');
    }
    if (!title) {
      throw new ErrorDetail(400, 'Judul komponen SPML wajib diisi');
    }
    if (bobot !== undefined && bobot !== null && (isNaN(bobot) || bobot < 0 || bobot > 100)) {
      throw new ErrorDetail(400, 'Nilai bobot tidak valid (0-100)');
    }
    if (urut !== undefined && urut !== null && typeof urut !== 'string') {
      throw new ErrorDetail(400, 'Urut komponen SPML harus berupa teks');
    }

    const result = await komponenSpml.editKomponenSpml({ id: Number(id), title, bobot, alias, detail, urut: typeof urut === 'string' && urut.trim() ? urut.trim() : null });
    return res.status(200).json({ success: true, message: 'Komponen SPML updated successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const deleteKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id ? Number(req.params.id) : Number(req.body.id);
    if (!id || isNaN(id)) {
      throw new ErrorDetail(400, 'ID komponen SPML tidak valid');
    }

    const result = await komponenSpml.deleteKomponenSpml(id);
    return res.status(200).json({ success: true, message: 'Komponen SPML deleted successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 2. SUBKOMPONEN SPML CONTROLLER
// =============================================================================
export const getAllSubKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subKomponenSpml.getAllSubKomponenSpml();
    return res.status(200).json({ success: true, message: 'Get subkomponen SPML success', rows: result });
  } catch (err) {
    next(err);
  }
};

export const createSubKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { komponen_spml_id, title, detail, urut } = req.body;
    if (!komponen_spml_id || !title) {
      throw new ErrorDetail(400, 'Komponen SPML ID dan Judul subkomponen wajib diisi');
    }
    if (urut !== undefined && urut !== null && typeof urut !== 'string') {
      throw new ErrorDetail(400, 'Urut subkomponen SPML harus berupa teks');
    }

    const result = await subKomponenSpml.createSubKomponenSpml({
      komponen_spml_id: Number(komponen_spml_id),
      title,
      detail: detail ?? null,
      urut: typeof urut === 'string' && urut.trim() ? urut.trim() : null,
    });

    return res.status(200).json({ success: true, message: 'Subkomponen SPML created successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const editSubKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, komponen_spml_id, title, detail, urut } = req.body;
    if (!id || !komponen_spml_id || !title) {
      throw new ErrorDetail(400, 'ID, Komponen SPML ID, dan Judul wajib diisi');
    }
    if (urut !== undefined && urut !== null && typeof urut !== 'string') {
      throw new ErrorDetail(400, 'Urut subkomponen SPML harus berupa teks');
    }

    const result = await subKomponenSpml.editSubKomponenSpml({
      id: Number(id),
      komponen_spml_id: Number(komponen_spml_id),
      title,
      detail,
      urut: typeof urut === 'string' && urut.trim() ? urut.trim() : null,
    });

    return res.status(200).json({ success: true, message: 'Subkomponen SPML updated successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const deleteSubKomponenSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id ? Number(req.params.id) : Number(req.body.id);
    if (!id || isNaN(id)) {
      throw new ErrorDetail(400, 'ID subkomponen SPML tidak valid');
    }

    const result = await subKomponenSpml.deleteSubKomponenSpml(id);
    return res.status(200).json({ success: true, message: 'Subkomponen SPML deleted successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 3. ASPEK SPML CONTROLLER
// =============================================================================
export const getAllAspekSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await aspekSpml.getAllAspekSpml();
    return res.status(200).json({ success: true, message: 'Get aspek SPML success', rows: result });
  } catch (err) {
    next(err);
  }
};

export const createAspekSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { urut, urut_huruf, komponen_spml_id, subkomponen_spml_id, title, detail } = req.body;
    if (urut === undefined || !komponen_spml_id || !subkomponen_spml_id || !title) {
      throw new ErrorDetail(400, 'Urut, Komponen SPML ID, SubKomponen SPML ID, dan Judul aspek wajib diisi');
    }

    const result = await aspekSpml.createAspekSpml({
      urut: Number(urut),
      urut_huruf: urut_huruf ?? null,
      komponen_spml_id: Number(komponen_spml_id),
      subkomponen_spml_id: Number(subkomponen_spml_id),
      title,
      detail: detail ?? null,
    });

    return res.status(200).json({ success: true, message: 'Aspek SPML created successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const editAspekSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, urut, urut_huruf, komponen_spml_id, subkomponen_spml_id, title, detail } = req.body;
    if (!id || urut === undefined || !komponen_spml_id || !subkomponen_spml_id || !title) {
      throw new ErrorDetail(400, 'ID, Urut, Komponen SPML ID, SubKomponen SPML ID, dan Judul aspek wajib diisi');
    }

    const result = await aspekSpml.editAspekSpml({
      id: Number(id),
      urut: Number(urut),
      urut_huruf: urut_huruf ?? null,
      komponen_spml_id: Number(komponen_spml_id),
      subkomponen_spml_id: Number(subkomponen_spml_id),
      title,
      detail,
    });

    return res.status(200).json({ success: true, message: 'Aspek SPML updated successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const deleteAspekSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id ? Number(req.params.id) : Number(req.body.id);
    if (!id || isNaN(id)) {
      throw new ErrorDetail(400, 'ID aspek SPML tidak valid');
    }

    const result = await aspekSpml.deleteAspekSpml(id);
    return res.status(200).json({ success: true, message: 'Aspek SPML deleted successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

// =============================================================================
// 4. CHECKLIST SPML CONTROLLER
// =============================================================================
export const getAllChecklistSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checklistSpml.getAllChecklistSpml();
    return res.status(200).json({ success: true, message: 'Get checklist SPML success', rows: result });
  } catch (err) {
    next(err);
  }
};

export const createChecklistSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, uraian, dokumen, komponen_spml_id, subkomponen_spml_id, aspek_spml_id } = req.body;
    if (!uraian || !komponen_spml_id || !subkomponen_spml_id || !aspek_spml_id) {
      throw new ErrorDetail(400, 'Uraian, Komponen SPML ID, SubKomponen SPML ID, dan Aspek SPML ID wajib diisi');
    }

    const result = await checklistSpml.createChecklistSpml({
      title: title ?? null,
      uraian,
      dokumen: dokumen ?? null,
      komponen_spml_id: Number(komponen_spml_id),
      subkomponen_spml_id: Number(subkomponen_spml_id),
      aspek_spml_id: Number(aspek_spml_id),
    });

    return res.status(200).json({ success: true, message: 'Checklist SPML created successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const editChecklistSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, title, uraian, dokumen, komponen_spml_id, subkomponen_spml_id, aspek_spml_id } = req.body;
    if (!id || !uraian || !komponen_spml_id || !subkomponen_spml_id || !aspek_spml_id) {
      throw new ErrorDetail(400, 'ID, Uraian, Komponen SPML ID, SubKomponen SPML ID, dan Aspek SPML ID wajib diisi');
    }

    const result = await checklistSpml.editChecklistSpml({
      id: Number(id),
      title: title ?? null,
      uraian,
      dokumen: dokumen ?? null,
      komponen_spml_id: Number(komponen_spml_id),
      subkomponen_spml_id: Number(subkomponen_spml_id),
      aspek_spml_id: Number(aspek_spml_id),
    });

    return res.status(200).json({ success: true, message: 'Checklist SPML updated successfully', rows: result });
  } catch (err) {
    next(err);
  }
};

export const deleteChecklistSpml = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id ? Number(req.params.id) : Number(req.body.id);
    if (!id || isNaN(id)) {
      throw new ErrorDetail(400, 'ID checklist SPML tidak valid');
    }

    const result = await checklistSpml.deleteChecklistSpml(id);
    return res.status(200).json({ success: true, message: 'Checklist SPML deleted successfully', rows: result });
  } catch (err) {
    next(err);
  }
};
