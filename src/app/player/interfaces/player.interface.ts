import { Pagination, PaginationOptions } from '../../shared/interfaces/pagination.interface';

export interface PlayersResponse {
  items: Player[];
  pagination: Pagination;
}

export interface Player {
  id:          string;
  name:        string;
  lastName:    string;
  genderType:  string;
  dni:         string;
  phoneNumber: string;
}

export interface PlayerOptions extends PaginationOptions {

}
