import { Component, inject, signal } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { ListComponent } from '../../components/list/list.component';
import { CreateButtonComponent } from "../../components/create-button/create-button.component";

@Component({
  selector: 'app-tournament-list-page',
  imports: [SearchInputComponent, ListComponent, CreateButtonComponent],
  templateUrl: './tournament-list-page.component.html',
})
export class TournamentListPageComponent {

  tournamentService = inject(TournamentService);
  query = signal<string>('');

  tournamentResource = rxResource({
    stream: () => this.tournamentService.getAll()
  });
}
