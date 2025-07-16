import { Pipe, PipeTransform } from '@angular/core';
import { EnumLabelMap } from '../constants/enum-labels';
import { EnumOption } from '../../enum/interfaces/enum.interface';

@Pipe({
  name: 'enumLabel',
  pure: true,
})
export class EnumLabelPipe implements PipeTransform {

  // Sobrecarga para EnumOption
  transform(value: EnumOption, enumName: string): string;
  // Sobrecarga para string
  transform(value: string, enumName: string): string;
  // Sobrecarga para valores nullable
  transform(value: EnumOption | string | null | undefined, enumName: string): string;

  transform(value: EnumOption | string | null | undefined, enumName: string): string {
    // Validaciones tempranas
    if (!value || !enumName) {
      return '';
    }

    // Obtener la clave del valor
    const valueKey = typeof value === 'string' ? value : value.value;

    // Validar que valueKey no sea null/undefined
    if (!valueKey) {
      return '';
    }

    // Buscar en el mapa de etiquetas con múltiples intentos
    const enumLabels = this.findEnumLabels(enumName);

    if (!enumLabels) {
      console.warn(`Enum "${enumName}" no encontrado en EnumLabelMap`);
      return valueKey;
    }

    // Retornar la etiqueta o el valor original como fallback
    return enumLabels[valueKey] ?? valueKey;
  }

  private findEnumLabels(enumName: string): Record<string, string> | null {
    // Intentar búsqueda directa
    if (EnumLabelMap[enumName]) {
      return EnumLabelMap[enumName];
    }

    // Intentar sin el sufijo "-types"
    const nameWithoutTypes = enumName.replace('-types', '');
    if (EnumLabelMap[nameWithoutTypes]) {
      return EnumLabelMap[nameWithoutTypes];
    }

    // Intentar conversión a camelCase
    const camelCaseName = this.toCamelCase(nameWithoutTypes);
    if (EnumLabelMap[camelCaseName]) {
      return EnumLabelMap[camelCaseName];
    }

    // Intentar con el sufijo "-types" agregado
    const nameWithTypes = `${nameWithoutTypes}-types`;
    if (EnumLabelMap[nameWithTypes]) {
      return EnumLabelMap[nameWithTypes];
    }

    return null;
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}
