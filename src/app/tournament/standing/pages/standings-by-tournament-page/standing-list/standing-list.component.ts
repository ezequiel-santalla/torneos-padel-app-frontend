import { Component, computed, input } from '@angular/core';
import { Standing } from '../../../interfaces/standing.interface';
import { Progress } from '../../../../progress/interfaces/progress.interface';
import { PercentPipe } from '@angular/common';
import { EnumLabelPipe } from '../../../../../shared/pipes/enum-label.pipe';
import { ChartIconComponent } from "../../../../../icons/chart-icon/chart-icon.component";

@Component({
  selector: 'standing-list',
  standalone: true,
  imports: [PercentPipe, EnumLabelPipe, ChartIconComponent],
  templateUrl: './standing-list.component.html',
})
export class StandingListComponent {
  standings = input.required<Standing[]>();
  progress = input<Progress>();
  isTournamentFinished = input.required<boolean>();

  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);

  isEmpty = computed(() => this.standings().length === 0);
  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );

  safeProgress = computed(() => ({
    totalMatches: this.progress()?.totalMatches || 0,
    completedMatches: this.progress()?.completedMatches || 0,
    status: this.progress()?.status || { value: 'UNKNOWN', label: 'Unknown' },
    completionPercentage: this.progress()?.completionPercentage || 0
  }));
}
