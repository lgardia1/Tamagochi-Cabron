import { Game } from "../../game/entities/Game";
import { Player } from "../../player/entities/Player";

export const RoomConfig = {
    maxRoomPlayers : 3
};

export interface Room {
    name : string;
    players : Player[];
    occupied: Boolean;
    game: Game |null;
}