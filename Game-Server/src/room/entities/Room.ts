import { Game } from "../../game/entities/Game";
import { Player } from "../../player/entities/Player";
import dotenv from "dotenv";
dotenv.config();

export const RoomConfig = {
  MAX_ROOM_PLAYER:
    process.env.MAX_ROOM_PLAYER === undefined ||
    Number(process.env.MAX_ROOM_PLAYER) > 4 ||
    Number(process.env.MAX_ROOM_PLAYER) < 2
      ? 4
      : Number(process.env.MAX_ROOM_PLAYER),
};

export interface Room {
  name: string;
  players: Player[];
  occupied: Boolean;
  game: Game | null;
}
