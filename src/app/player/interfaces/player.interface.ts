import { EnumOption } from "../../enum/interfaces/enum.interface";
import { Pagination, PaginationOptions } from '../../shared/interfaces/pagination.interface';

export interface PlayersResponse {
  items: Player[];
  pagination: Pagination;
}

export interface Player {
  id:          string;
  name:        string;
  lastName:    string;
  genderType:  EnumOption;
  dni:         string;
  phoneNumber: string;
}

export interface PlayerOptions extends PaginationOptions {

}
