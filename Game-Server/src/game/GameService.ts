import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameConf, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService";
import { genRanHexId } from "../util/util";
import PlayerHanlde from "./PlayerHandle";

export class GameService {
  private games: Game[];

  private static instance: GameService;
  private constructor() {
    this.games = [];
  }

  public static getInstance(): GameService {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new GameService();
    return this.instance;
  }

  public buildPlayer(socketId: string): Player {
    const directions = Object.keys(Directions);
    return {
      id: socketId,
      x: 0,
      y: 0,
      state: PlayerStates.Live,
      direction: directions[
        Math.floor(Math.random() * directions.length)
      ] as Directions,
      visibility: true,
    };
  }

  public addPlayer(player: Player): boolean {
    const room: Room = RoomService.getInstance().addPlayer(player);

    if (room === null) return false;

    if (room.players.length === 1 && room.game === null) {
      this.addGame(room);
    }

    if (room.game === null) return false;

    PlayerHanlde.setPlayerInitialPositon(player, room.game);

    ServerService.getInstance().sendMessageToPlayer(
      player.id,
      Messages.JOIN_GAME,
      {
        gameId: room.game.id,
        player: player,
        players: room.players.filter((p) => {
          return p.id !== player.id;
        }),
        board: room.game.board,
      }
    );

    ServerService.getInstance().sendMessageToRoomExceptPlayer(
      player.id,
      room.name,
      Messages.NEW_PLAYER,
      player
    );

    if (room.occupied) this.startGame(room);

    return true;
  }

  private addGame(room: Room) {
    const game: Game = {
      id: "game" + genRanHexId(128),
      state: GameStates.WAITING,
      room: room,
      board: new BoardBuilder().getBoard(),
    };

    room.game = game;
    this.games.push(game);
  }

  private startGame(room: Room) {
    if (room.game === null) return;

    ServerService.getInstance().sendMessageToRoom(
      room.name,
      Messages.START_COUNT_DOWN,
      {
        time: GameConf.COUNT_DOWN,
      }
    );

    room.game.state = GameStates.COUNT_DOWN;

    setTimeout(() => {
      if (room.game === null || room.game.state !== GameStates.COUNT_DOWN) return;

      room.game.state = GameStates.PLAYING;
      ServerService.getInstance().sendMessageToRoom(
        room.name,
        Messages.START_GAME,
        {}
      );
    }, GameConf.COUNT_DOWN * 1000);
  }

  public removePlayer(id: string) {
    const game = this.games.find((game) => {
      const index = game.room.players.findIndex(
        (player: Player) => player.id === id
      );

      if (index !== -1) {
        ServerService.getInstance().sendMessageToRoom(
          game.room.name,
          Messages.DISCONNECTED_PLAYER,
          game.room.players[index]
        );
        game.room.players.splice(index, 1);
        console.log("Jugador eliminado de la sala");
        return true;
      }

      return false;
    });

    if (game === undefined) return;

    if (game.room.players.length <= 0) {
      RoomService.getInstance().removeRoom(game.room);
      this.endGame(game);
      return;
    }

    const alivePeople = this.getAlivePlayers(game);

    if(alivePeople === 1 && game.state === GameStates.PLAYING){
      ServerService.getInstance().sendMessageToRoom(
        game.room.name,
        Messages.WINNER,
        {}
      );
      RoomService.getInstance().removeRoom(game.room);
      this.endGame(game);
      return;
    }

    if(game.state === GameStates.COUNT_DOWN) {
        game.state = GameStates.WAITING;
    }

    if(game.room.occupied === true) {
      game.room.occupied = false;
    }
  }

  private endGame(currentGame: Game) {
    const index = this.games.indexOf(currentGame);
    if (index >= -1) {
      console.log("Juego Terminado: " + currentGame.id);
      this.games.splice(index, 1);
    }
  }

  private getAlivePlayers(game: Game) {
    return game.room.players.filter(
      (player) => player.state !== PlayerStates.Dead
    ).length;
  }

  public getGameById(gameId: string): Game | undefined {
    return this.games.find((game) => game.id === gameId);
  }
}
