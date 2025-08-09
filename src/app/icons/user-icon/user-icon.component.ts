import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'user-icon',
  imports: [],
  templateUrl: './user-icon.component.html',
})
export class UserIconComponent {

  iconWidth = input.required<number>();
  iconHeight = input.required<number>();
}
