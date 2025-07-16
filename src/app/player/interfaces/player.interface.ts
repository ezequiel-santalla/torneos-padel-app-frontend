import { EnumOption } from "../../enum/interfaces/enum.interface";

export interface Player {
  id:          string;
  name:        string;
  lastName:    string;
  genderType:  EnumOption;
  dni:         string;
  phoneNumber: string;
}
