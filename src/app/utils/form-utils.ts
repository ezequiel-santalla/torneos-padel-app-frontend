import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

async function sleep() {
  return new Promise(resolve => setTimeout(resolve, 2500));
}

export class FormUtils {

  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  };

  static isPasswordOneEqualsPasswordTwo(pass1: string, pass2: string): (formGroup: AbstractControl) => { [key: string]: boolean } | null {
    return (formGroup: AbstractControl) => {

      const value1 = formGroup.get(pass1)?.value;
      const value2 = formGroup.get(pass2)?.value;

      return value1 === value2 ? null : { passwordsNotEqual: true };
    }
  };

  static isStartDateBeforeEndDate(startDate: string, endDate: string): (formGroup: AbstractControl) => { [key: string]: boolean } | null {
    return (formGroup: AbstractControl) => {

      const start = new Date(formGroup.get(startDate)?.value);
      const end = new Date(formGroup.get(endDate)?.value);

      return start < end ? null : { startDateAfterEndDate: true };
    }
  };

  static getTextError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio.';

        case 'minlength':
          return `Debe tener al menos ${errors[key].requiredLength} caracteres.`;

        case 'maxlength':
          return `No puede exceder los ${errors[key].requiredLength} caracteres.`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico.';
          }

          return 'El formato del campo es incorrecto.';

        case 'emailTaken':
          return 'El correo electrónico ya está en uso por otro usuario.';

        case 'startDateAfterEndDate':
          return 'La fecha de inicio debe ser anterior a la fecha de finalización.';

        default:
          return `Error de validación no controlado. ${key}`;
      }
    };

    return null;
  }
}
