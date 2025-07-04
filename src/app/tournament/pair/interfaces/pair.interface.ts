import { Player } from "../../../player/player.interface";

export interface Pair {
  id:       string;
  teamName: string;
  player1:  Player;
  player2:  Player;
}

