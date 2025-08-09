import { Pagination, PaginationOptions } from "../../shared/interfaces/pagination.interface";

export interface PlayersRankResponse {
  items: PlayerRanking[];
  pagination: Pagination;
}

export interface PlayerRanking {
  id:                string;
  name:              string;
  lastName:          string;
  genderType:        string;
  totalPoints:       number;
  tournamentsPlayed: number;
}

export interface RankingOptions extends PaginationOptions {
  gender?: string;
  category?: string;
}
