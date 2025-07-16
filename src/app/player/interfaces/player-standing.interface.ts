import { PlayerSummary } from "./player-summary.interface";

export interface PlayerStanding {
  playerSummary:      PlayerSummary;
  totalMatchesPlayed: number;
  totalMatchesWon:    number;
  totalMatchesLost:   number;
  matchesEfficiency:  number;
  totalGamesPlayed:   number;
  totalGamesWon:      number;
  totalGamesLost:     number;
  gamesEfficiency:    number;
}
