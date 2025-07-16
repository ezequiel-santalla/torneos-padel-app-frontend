import { Player } from "../../../player/interfaces/player.interface";

export interface Pair {
  id:       string;
  teamName: string;
  player1:  Player;
  player2:  Player;
}

