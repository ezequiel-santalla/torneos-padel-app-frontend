import { Component, computed, input, output, signal } from '@angular/core';
import { Match } from '../../interfaces/match.interface';
import { DatePipe } from '@angular/common';
import { EnumLabelPipe } from '../../../../shared/pipes/enum-label.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'match-list',
  standalone: true,
  imports: [DatePipe, EnumLabelPipe, FormsModule],
  templateUrl: './match-list.component.html',
})
export class MatchListComponent {
  matches = input.required<Match[]>();
  errorMessage = input<string | null>();
  isLoading = input<boolean>(false);

  // Output para notificar cuando se actualiza un resultado
  matchResultUpdated = output<{ matchId: string; pair1Score: number; pair2Score: number }>();

  isEmpty = computed(() => this.matches().length === 0);
  shouldShowList = computed(() =>
    !this.isLoading() && !this.errorMessage() && !this.isEmpty()
  );

  // Señales para manejar la edición
  editingMatchId = signal<string | null>(null);
  tempScores = signal<{ pair1Score: number; pair2Score: number }>({ pair1Score: 0, pair2Score: 0 });
  isUpdating = signal(false);

  startEdit(match: Match): void {
    this.editingMatchId.set(match.id);
    this.tempScores.set({
      pair1Score: match.pair1Score,
      pair2Score: match.pair2Score
    });
  }

  cancelEdit(): void {
    this.editingMatchId.set(null);
    this.tempScores.set({ pair1Score: 0, pair2Score: 0 });
  }

  saveResult(match: Match): void {
    const scores = this.tempScores();
    if (scores.pair1Score < 0 || scores.pair2Score < 0) return;

    this.isUpdating.set(true);

    // Emitir el evento para que el componente padre maneje la actualización
    this.matchResultUpdated.emit({
      matchId: match.id,
      pair1Score: scores.pair1Score,
      pair2Score: scores.pair2Score
    });
  }

  // Método para que el componente padre indique que la actualización terminó
  completeUpdate(success: boolean = true): void {
    this.isUpdating.set(false);
    if (success) {
      this.cancelEdit();
    }
  }
}
