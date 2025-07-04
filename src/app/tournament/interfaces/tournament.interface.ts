import { Pair } from "../pair/interfaces/pair.interface";

export interface Tournament {
  id:               string;
  name:             string;
  startDate:        Date;
  endDate:          Date;
  type:             string;
  status:           string;
  winningMatchRule: string;
  pairs:            Pair[];
}
