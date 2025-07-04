import { Pair } from "../../pair/interfaces/pair.interface";

export interface Match {
  id:            string;
  tournamentId:  string;
  pair1:         Pair;
  pair2:         Pair;
  pair1Score:    number;
  pair2Score:    number;
  scheduledDate: Date;
  status:        string;
}


