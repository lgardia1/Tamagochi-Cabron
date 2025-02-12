import {
  Directions,
  PlayerData,
  Player,
  PlayerStates,
} from "../player/entities/Player";
import { ServerService } from "../server/ServerService";
import { Board } from "./entities/Board";
import { Game, GameStates, Messages } from "./entities/Game";
import { GameService } from "./GameService";

export default class PlayerHanlde {
  public static setPlayerInitialPositon(player: Player, game: Game) {
    const board = game.board;

    const corners = [
      { x: 0, y: 0 },
      { x: 0, y: board.dimensions.width - 1 },
      { x: board.dimensions.height - 1, y: 0 },
      { x: board.dimensions.height - 1, y: board.dimensions.width - 1 },
    ];

    let occupied = true;

    while (corners.length > 0) {
      const index = Math.floor(Math.random() * corners.length);
      const corner = corners[index];

      // Verificar si está ocupado
      const occupied = game.room.players.some(
        (p) => player.id !== p.id && p.x === corner.x && p.y === corner.y
      );

      if (!occupied) {
        player.x = corner.x;
        player.y = corner.y;
        return;
      }

      corners.splice(index, 1);
    }
  }

  public static movePlayer(id: string, player: PlayerData) {
    const { gameId, direction } = player;
    if (gameId === undefined || direction === undefined) return;

    const game = GameService.getInstance().getGameById(gameId);
    if (game === undefined || game.state ===  GameStates.WAITING) return;

    const currentPlayer = game.room.players.find((p) => p.id === id) as Player;
    if (!this.checkPlayer(currentPlayer, direction)) return;

    const { x, y } = this.calculateNewPosition(currentPlayer, direction);

    if (this.isOccupied(x, y, game.room.players)) return;
    if (this.isOutOfBounds(x, y, game.board)) return;

    currentPlayer.x = x;
    currentPlayer.y = y;

    this.setVisibility(currentPlayer, game.board);

    ServerService.getInstance().sendMessageToRoom(
      game.room.name,
      Messages.MOVE_PLAYER,
      currentPlayer
    );
  }

  public static shootPlayer(id: string, player: PlayerData) {
  }

  public static diePlayer(id: string, player: PlayerData) {

  }

  /* Funciones Auxiliares */
  private static checkPlayer(player: Player, direction: Directions): boolean {
    return player.state !== PlayerStates.Dead && player.direction === direction;
  }

  private static calculateNewPosition(
    player: Player,
    direction: Directions
  ): { x: number; y: number } {
    const movementMap = {
      [Directions.Up]: { x: player.x, y: player.y + 1 },
      [Directions.Down]: { x: player.x, y: player.y - 1 },
      [Directions.Left]: { x: player.x - 1, y: player.y },
      [Directions.Right]: { x: player.x + 1, y: player.y },
    };

    return movementMap[direction] || { x: player.x, y: player.y };
  }

  private static isOutOfBounds(x: number, y: number, board: Board): boolean {
    return (
      x < 0 ||
      x >= board.dimensions.width ||
      y < 0 ||
      y >= board.dimensions.height
    );
  }

  private static isOccupied(x: number, y: number, players: Player[]): boolean {
    return players.some((p) => p.x === x && p.y === y);
  }

  private static setVisibility(player: Player, board: Board) {
    if (player.visibility === false) {
      player.visibility = true;
      return;
    }

    board.bushes.forEach((bush) => {
      if (player.x === bush.x && player.y === bush.y) {
        player.visibility = false;
      }
    });
  }
}
