import { EnumOption } from "../../enum/interfaces/enum.interface";
import { Pagination } from "../../shared/interfaces/pagination.interface";
import { Pair } from "../pair/interfaces/pair.interface";

export interface TournamentsResponse {
  items:      Tournament[];
  pagination: Pagination;
}

export interface Tournament {
  id:               string;
  name:             string;
  startDate:        Date;
  endDate:          Date;
  address:          string;
  tournamentType:   EnumOption;
  categoryType:     EnumOption;
  genderType:       EnumOption;
  status:           EnumOption;
  winningMatchRule: EnumOption;
  pairs:            Pair[];
}


