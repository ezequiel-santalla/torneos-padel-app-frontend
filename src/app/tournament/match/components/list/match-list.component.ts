import { Component, computed, input } from '@angular/core';
import { Match } from '../../interfaces/match.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';

@Component({
  selector: 'match-list',
  standalone: true,
  imports: [DatePipe, EnumLabelPipe],
  templateUrl: './match-list.component.html',
})
export class MatchListComponent {
  matches = input.required<Match[]>();

  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);

  isEmpty = computed(() => this.matches().length === 0);
  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );
}
