import { Pagination } from "../../shared/interfaces/pagination.interface";

export interface PlayersSummaryResponse {
  items: PlayerSummary[];
  pagination: Pagination;
}

export interface PlayerSummary {
  id:           string;
  name:         string;
  lastName:     string;
  genderType:   string;
}
