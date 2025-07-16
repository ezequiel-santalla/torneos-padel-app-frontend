import { Component, input, output } from '@angular/core';
import { Tournament } from '../../../tournament/interfaces/tournament.interface';

@Component({
  selector: 'delete-confirmation-modal',
  imports: [],
  templateUrl: './delete-confirmation-modal.component.html',
})
export class DeleteConfirmationModalComponent {

  isOpen = input.required<boolean>();
  tournamentToDelete = input<Tournament | null>();
  isDeleting = input<boolean>(false);

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
