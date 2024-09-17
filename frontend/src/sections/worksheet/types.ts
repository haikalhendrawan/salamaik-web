/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

export interface OpsiType{
    id: number,
    title: string, 
    value: number,
    checklist_id: number,
    positive_fallback: string,
    negative_fallback: string,
    rekomendasi: string
};

export interface WsJunctionType{
    junction_id: number,
    worksheet_id: string,
    checklist_id: number,
    kanwil_score: number | null,
    kppn_score: number | null,
    file_1: string | null,
    file_2: string | null,
    file_3: string | null,
    kanwil_note: string | null,
    kppn_id: string,
    period: string,
    last_update: string | null,
    updated_by: string | null,
    excluded: number,
    id: number,
    title: string | null, 
    header: string | null,
    komponen_id: number,
    subkomponen_id: number,
    subsubkomponen_id: number,
    standardisasi: number, 
    matrix_title: string | null, 
    file1: string | null,
    file2: string | null,
    instruksi: string | null,
    contoh_file: string | null,
    peraturan: string | null,
    uic: string | null,
    standardisasi_id: number | null,
    opsi: OpsiType[] | [] | null
}

export interface WorksheetType{
    id: string, 
    kppn_id: string,
    name: string, 
    alias: string,
    period: number,
    status: number,
    open_period: string,
    close_period: string,
    created_at: string,
    updated_at: string,
    matrix_status: number,
    open_follow_up: string,
    close_follow_up: string
}