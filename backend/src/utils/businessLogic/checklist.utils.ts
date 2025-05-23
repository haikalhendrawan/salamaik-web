import { FindingsType, ComprehensiveFindingsType } from "../../model/findings.model";
import { ChecklistType } from "../../model/checklist.model";
import { WorksheetType } from "../../model/worksheet.model";
import { WorksheetJunctionType } from "../../model/worksheetJunction.model";

// -------------------------------------------------------------------------------------------------------
export class ChecklistUtil{
  static minScore = 0;
  static maxScore = 10;
  static maxScoreStandardisasi = 12;

  static isMaxedScore(score: number | null, isStandardisasi: 0 | 1){
    return isStandardisasi ? score === this.maxScoreStandardisasi : score === this.maxScore
  }
}