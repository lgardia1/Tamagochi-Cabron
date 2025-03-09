import { Player } from "../player/entities/Player";
import { ServerService } from "../server/ServerService";
import { Room, RoomConfig } from "./entities/Room";
import { genRanHexId } from "../util/util";

export class RoomService {
  private rooms: Room[];
  private static instance: RoomService;
  private constructor() {
    this.rooms = [];
  }

  static getInstance(): RoomService {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new RoomService();
    return this.instance;
  }

  private getRoom(): Room {
    const room = this.rooms.find((item) => item.occupied === false);
    if (room === undefined) {
      const currentRoom: Room = {
        name: "room" + genRanHexId(128),
        players: [],
        occupied: false,
        game: null,
      };
      this.rooms.push(currentRoom);
      return currentRoom;
    }
    return room;
  }

  public addPlayer(player: Player): Room {
    const room: Room = this.getRoom();
    room.players.push(player);
    ServerService.getInstance().addPlayerToRoom(player.id, room.name);
    if (room.players.length === RoomConfig.MAX_ROOM_PLAYER) room.occupied = true;
    return room;
  }

  public removeRoom(currentRoom: Room) {
    const index = this.rooms.indexOf(currentRoom);
    if (index >= -1) {
      console.log("Sala eliminada: " + currentRoom.name);
      this.rooms.splice(index, 1);  
    }
  }
}
