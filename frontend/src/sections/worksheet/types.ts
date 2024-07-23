export interface OpsiType{
    id: number,
    title: string, 
    value: number,
    checklist_id: number
};

export interface WsJunctionType{
    junction_id: number,
    worksheet_id: string,
    checklist_id: number,
    kanwil_score: number,
    kppn_score: number,
    file_1: string,
    file_2: string,
    file_3: string,
    kanwil_note: string,
    kppn_id: string,
    period: string,
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
    opsi: OpsiType[] | [] | null
}