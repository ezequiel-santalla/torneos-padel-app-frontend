import { EnumOption } from "../../../enum/interfaces/enum.interface";

export interface Progress {
  totalMatches:         number;
  completedMatches:     number;
  status:               EnumOption;
  completionPercentage: number;
}



