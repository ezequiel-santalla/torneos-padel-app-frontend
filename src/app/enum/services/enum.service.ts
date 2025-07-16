import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ENUM_URLS } from '../../constants/api.constants';
import { EnumName, EnumOption } from '../interfaces/enum.interface';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  private http = inject(HttpClient);

  getEnumValues(enumName: EnumName): Observable<EnumOption[]> {
    return this.http.get<string[]>(`${ENUM_URLS.ENUMS}/${enumName}`)
      .pipe(
        map((stringArray: string[]) =>
          stringArray.map(value => ({ value }))
        )
      );
  }
};
