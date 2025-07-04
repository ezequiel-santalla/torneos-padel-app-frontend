import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tournament-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {

  placeholder = input<string>('Search')
  value = output<string>();
}
