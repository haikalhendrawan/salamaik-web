import { FindingsType, ComprehensiveFindingsType } from "../../model/findings.model";
import { ChecklistType } from "../../model/checklist.model";
import { WorksheetType } from "../../model/worksheet.model";
import { WorksheetJunctionType } from "../../model/worksheetJunction.model";


export class WorksheetUtil{
  static isPastClosePeriod(closePeriod: Date){
    const now = new Date();
    const pastDue = now > closePeriod;

    return pastDue
  }

  static isPastFollowUpPeriod(closeFollowUp: Date){
    const now = new Date();
    const pastDue = now > closeFollowUp;

    return pastDue
  }
}