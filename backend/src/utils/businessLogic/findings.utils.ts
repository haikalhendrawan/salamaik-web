import { FindingsType, ComprehensiveFindingsType, DerivedFindingsType } from "../../model/findings.model";
import { ChecklistType } from "../../model/checklist.model";
import { WorksheetType } from "../../model/worksheet.model";
import { WorksheetJunctionType } from "../../model/worksheetJunction.model";
import { ChecklistUtil } from "./checklist.utils";
import { WorksheetUtil } from "./worksheet.utils";

export class FindingsUtil {
  static isFinal(derivedFindings: DerivedFindingsType[]) {
    if(!derivedFindings || derivedFindings.length === 0) {
      return false
    };

    return WorksheetUtil.isPastFollowUpPeriod(derivedFindings[0].worksheet.close_follow_up)
  }

  static getAmountFinal(derivedFindings: DerivedFindingsType[]) {
    if(!derivedFindings || derivedFindings.length === 0) {
      return 0
    };

    return derivedFindings
            .filter((item) => !(ChecklistUtil.isMaxedScore(item.ws_junction.kanwil_score, item.checklist.standardisasi)))
            .length
  
  }

  static getAmountNonFinal(derivedFindings: DerivedFindingsType[]) {
    if(!derivedFindings || derivedFindings.length === 0) {
      return 0
    };

    return derivedFindings.length
  }

  static getAmount(derivedFindings: DerivedFindingsType[]) {
    if(!derivedFindings || derivedFindings.length === 0) {
      return 0
    };

    if(this.isFinal(derivedFindings)) {
      return this.getAmountFinal(derivedFindings)
    }

    return this.getAmountNonFinal(derivedFindings)
  }

  static getFinal(derivedFindings: DerivedFindingsType[]){
    if(!derivedFindings || derivedFindings.length === 0) {
      return null
    };

    const finalFindings = derivedFindings
                          .filter((item) => !(ChecklistUtil.isMaxedScore(item.ws_junction.kanwil_score, item.checklist.standardisasi)))

    return finalFindings
  }
}