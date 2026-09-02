/**
 * Salamaik API
 * Controller CRUD referensi Kertas Kerja Capaian Kinerja (CK)
 */

import { NextFunction, Request, Response } from 'express';
import {
  CkScoreValue,
  checklistCk,
  komponenCk,
  opsiCk,
} from '../model/ckRef.model';
import ErrorDetail from '../model/error.model';

function parsePositiveInteger(value: unknown, fieldName: string): number {
  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    throw new ErrorDetail(400, `${fieldName} wajib berupa integer positif`);
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ErrorDetail(400, `${fieldName} wajib berupa integer positif`);
  }
  return parsed;
}

function parseRequiredText(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ErrorDetail(400, `${fieldName} wajib diisi`);
  }
  return value.trim();
}

function parseOptionalText(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') {
    throw new ErrorDetail(400, `${fieldName} harus berupa teks`);
  }
  const parsed = value.trim();
  return parsed === '' ? null : parsed;
}

function parseScoreValue(value: unknown): CkScoreValue {
  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    throw new ErrorDetail(400, 'Nilai opsi CK wajib diisi');
  }

  const parsed = Number(value);
  if (parsed !== 0 && parsed !== 5 && parsed !== 10) {
    throw new ErrorDetail(400, 'Nilai opsi CK hanya dapat berupa 0, 5, atau 10');
  }
  return parsed;
}

function getRequestPeraturan(req: Request): number {
  return parsePositiveInteger(req.payload?.peraturan, 'Peraturan');
}

// =============================================================================
// KOMPONEN CK
// =============================================================================

export const getAllKomponenCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await komponenCk.getAll(getRequestPeraturan(req));
    return res.status(200).json({
      success: true,
      message: 'Get komponen CK success',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createKomponenCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { urut, title, alias, detail } = req.body ?? {};
    const result = await komponenCk.create({
      peraturan: getRequestPeraturan(req),
      urut: parseRequiredText(urut, 'Urut komponen CK'),
      title: parseRequiredText(title, 'Judul komponen CK'),
      alias: parseOptionalText(alias, 'Alias komponen CK'),
      detail: parseOptionalText(detail, 'Detail komponen CK'),
    });

    return res.status(201).json({
      success: true,
      message: 'Komponen CK created successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const editKomponenCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, urut, title, alias, detail } = req.body ?? {};
    const peraturan = getRequestPeraturan(req);
    const result = await komponenCk.edit(
      {
        id: parsePositiveInteger(id, 'ID komponen CK'),
        urut: parseRequiredText(urut, 'Urut komponen CK'),
        title: parseRequiredText(title, 'Judul komponen CK'),
        alias: parseOptionalText(alias, 'Alias komponen CK'),
        detail: parseOptionalText(detail, 'Detail komponen CK'),
      },
      peraturan
    );

    return res.status(200).json({
      success: true,
      message: 'Komponen CK updated successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteKomponenCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parsePositiveInteger(req.body?.id, 'ID komponen CK');
    const result = await komponenCk.delete(id, getRequestPeraturan(req));
    return res.status(200).json({
      success: true,
      message: 'Komponen CK deleted successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// CHECKLIST CK
// =============================================================================

export const getAllChecklistCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await checklistCk.getAll(getRequestPeraturan(req));
    return res.status(200).json({
      success: true,
      message: 'Get checklist CK success',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createChecklistCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { komponen_ck_id, urut, materi, kriteria_penilaian, bukti_dukung } =
      req.body ?? {};
    const peraturan = getRequestPeraturan(req);
    const result = await checklistCk.create(
      {
        komponen_ck_id: parsePositiveInteger(komponen_ck_id, 'ID komponen CK'),
        urut: parsePositiveInteger(urut, 'Urut checklist CK'),
        materi: parseRequiredText(materi, 'Materi checklist CK'),
        kriteria_penilaian: parseRequiredText(
          kriteria_penilaian,
          'Kriteria penilaian CK'
        ),
        bukti_dukung: parseOptionalText(bukti_dukung, 'Bukti dukung CK'),
      },
      peraturan
    );

    return res.status(201).json({
      success: true,
      message: 'Checklist CK created successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const editChecklistCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, komponen_ck_id, urut, materi, kriteria_penilaian, bukti_dukung } =
      req.body ?? {};
    const peraturan = getRequestPeraturan(req);
    const result = await checklistCk.edit(
      {
        id: parsePositiveInteger(id, 'ID checklist CK'),
        komponen_ck_id: parsePositiveInteger(komponen_ck_id, 'ID komponen CK'),
        urut: parsePositiveInteger(urut, 'Urut checklist CK'),
        materi: parseRequiredText(materi, 'Materi checklist CK'),
        kriteria_penilaian: parseRequiredText(
          kriteria_penilaian,
          'Kriteria penilaian CK'
        ),
        bukti_dukung: parseOptionalText(bukti_dukung, 'Bukti dukung CK'),
      },
      peraturan
    );

    return res.status(200).json({
      success: true,
      message: 'Checklist CK updated successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChecklistCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parsePositiveInteger(req.body?.id, 'ID checklist CK');
    const result = await checklistCk.delete(id, getRequestPeraturan(req));
    return res.status(200).json({
      success: true,
      message: 'Checklist CK deleted successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

// =============================================================================
// OPSI CK
// =============================================================================

export const getAllOpsiCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawChecklistCkId = req.query.checklistCkId;
    const checklistCkId =
      rawChecklistCkId === undefined
        ? undefined
        : parsePositiveInteger(rawChecklistCkId, 'ID checklist CK');
    const result = await opsiCk.getAll(getRequestPeraturan(req), checklistCkId);

    return res.status(200).json({
      success: true,
      message: 'Get opsi CK success',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOpsiCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { checklist_ck_id, label, description, value, urut } = req.body ?? {};
    const peraturan = getRequestPeraturan(req);
    const result = await opsiCk.create(
      {
        checklist_ck_id: parsePositiveInteger(checklist_ck_id, 'ID checklist CK'),
        label: parseRequiredText(label, 'Label opsi CK'),
        description: parseOptionalText(description, 'Deskripsi opsi CK'),
        value: parseScoreValue(value),
        urut: parsePositiveInteger(urut, 'Urut opsi CK'),
      },
      peraturan
    );

    return res.status(201).json({
      success: true,
      message: 'Opsi CK created successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const editOpsiCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, checklist_ck_id, label, description, value, urut } = req.body ?? {};
    const peraturan = getRequestPeraturan(req);
    const result = await opsiCk.edit(
      {
        id: parsePositiveInteger(id, 'ID opsi CK'),
        checklist_ck_id: parsePositiveInteger(checklist_ck_id, 'ID checklist CK'),
        label: parseRequiredText(label, 'Label opsi CK'),
        description: parseOptionalText(description, 'Deskripsi opsi CK'),
        value: parseScoreValue(value),
        urut: parsePositiveInteger(urut, 'Urut opsi CK'),
      },
      peraturan
    );

    return res.status(200).json({
      success: true,
      message: 'Opsi CK updated successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOpsiCk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parsePositiveInteger(req.body?.id, 'ID opsi CK');
    const result = await opsiCk.delete(id, getRequestPeraturan(req));
    return res.status(200).json({
      success: true,
      message: 'Opsi CK deleted successfully',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};
