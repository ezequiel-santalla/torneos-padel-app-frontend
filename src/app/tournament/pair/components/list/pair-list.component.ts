import { Component, computed, input } from '@angular/core';
import { Pair } from '../../interfaces/pair.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pair-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pair-list.component.html',
})
export class PairListComponent {
  pairs = input.required<Pair[]>();
  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);

  isEmpty = computed(() => this.pairs().length === 0);
  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );
}
