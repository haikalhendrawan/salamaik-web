import { FindingsType, ComprehensiveFindingsType } from "../../model/findings.model";
import { ChecklistType } from "../../model/checklist.model";
import { WorksheetType } from "../../model/worksheet.model";
import { WorksheetJunctionType } from "../../model/worksheetJunction.model";
import { ChecklistUtil } from "./checklist.utils";
import { WorksheetUtil } from "./worksheet.utils";

export class FindingsUtil {
  static isFinal(comprehensiveFindings: ComprehensiveFindingsType[]) {
    if(!comprehensiveFindings || comprehensiveFindings.length === 0) {
      return false
    };

    return WorksheetUtil.isPastFollowUpPeriod(comprehensiveFindings[0].close_follow_up)
  }

  static getAmountFinal(comprehensiveFindings: ComprehensiveFindingsType[]) {
    if(!comprehensiveFindings || comprehensiveFindings.length === 0) {
      return false
    };

    return comprehensiveFindings
            .filter((item) => ChecklistUtil.isMaxedScore(item.kanwil_score, item.standardisasi))
            .length
  }

  static getAmountNonFinal(comprehensiveFindings: ComprehensiveFindingsType[]) {
    if(!comprehensiveFindings || comprehensiveFindings.length === 0) {
      return false
    };

    return comprehensiveFindings.length
  }

  static getAmount(comprehensiveFindings: ComprehensiveFindingsType[]) {
    if(!comprehensiveFindings || comprehensiveFindings.length === 0) {
      return false
    };

    if(this.isFinal(comprehensiveFindings)) {
      return this.getAmountFinal(comprehensiveFindings)
    }

    return this.getAmountNonFinal(comprehensiveFindings)
  }

  static getFinal(comprehensiveFindings: ComprehensiveFindingsType[]){
    if(!comprehensiveFindings || comprehensiveFindings.length === 0) {
      return false
    };

    const finalFindings = comprehensiveFindings
                          .filter((item) => ChecklistUtil.isMaxedScore(item.kanwil_score, item.standardisasi))

    return finalFindings
  }
}