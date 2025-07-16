import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { DocumentIconComponent } from "../../../icons/document-icon/document-icon.component";
import { PhoneIconComponent } from "../../../icons/phone-icon/phone-icon.component";
import { MailIconComponent } from "../../../icons/mail-icon/mail-icon.component";
import { PasswordIconComponent } from "../../../icons/password-icon/password-icon.component";
import { AddUserIconComponent } from "../../../icons/add-user-icon/add-user-icon.component";
import { ResetIconComponent } from "../../../icons/reset-icon/reset-icon.component";
import { UserIconComponent } from "../../../icons/user-icon/user-icon.component";

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, DocumentIconComponent, PhoneIconComponent, MailIconComponent, PasswordIconComponent, AddUserIconComponent, ResetIconComponent, UserIconComponent],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required], []],
    lastName: ['', [Validators.required], []],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)], []],
    dni: ['', [Validators.required], []],
    phone: ['', [Validators.required], []],
    password: ['', [Validators.required, Validators.minLength(6)], []],
    confirmPassword: ['', [Validators.required], []],
  }, {
    validators: [
      FormUtils.isPasswordOneEqualsPasswordTwo('password', 'confirmPassword')
    ]
  });

  private resetForm() {
    this.myForm.reset({
      name: '',
      lastName: '',
      email: '',
      dni: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();

      return;
    }

    this.resetForm();
  }

  onCancel() {
    this.resetForm();
  }
}
