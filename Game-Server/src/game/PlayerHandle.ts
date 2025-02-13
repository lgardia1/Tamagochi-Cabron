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
    const { gameId } = player;
    if (gameId === undefined) return;

    const game = GameService.getInstance().getGameById(gameId);
    if (game === undefined || game.state !== GameStates.PLAYING) return;

    const currentPlayer = game.room.players.find((p) => p.id === id) as Player;
    if (currentPlayer.state === PlayerStates.Dead) return;

    const { x, y } = this.calculateNewPosition(
      currentPlayer,
      currentPlayer.direction
    );

    if (this.isOccupied(x, y, game.room.players) !== undefined) return;
    if (this.isOutOfBounds(x, y, game.board)) return;

    currentPlayer.x = x;
    currentPlayer.y = y;

    this.setVisibility(currentPlayer, game.board);

    ServerService.getInstance().sendMessageToRoom(
      game.room.name,
      Messages.MOVE_PLAYER,
      {
        id: currentPlayer.id,
        x: currentPlayer.x,
        y: currentPlayer.y,
        visibility: currentPlayer.visibility,
      }
    );
  }

  public static rotatePlayer(id: string, player: PlayerData) {
    const { gameId } = player;
    if (gameId === undefined) return;

    const game = GameService.getInstance().getGameById(gameId);
    if (game === undefined || game.state !== GameStates.PLAYING) return;

    const currentPlayer = game.room.players.find((p) => p.id === id) as Player;
    if (currentPlayer.state === PlayerStates.Dead) return;

    const direction = this.changeDirection(currentPlayer.direction);
    currentPlayer.direction = direction;

    ServerService.getInstance().sendMessageToRoom(
      game.room.name,
      Messages.ROTATE_PLAYER,
      {
        id: id,
        direction: currentPlayer.direction,
      }
    );
  }

  public static shootPlayer(id: string, player: PlayerData) {
    const { gameId } = player;
    if (gameId === undefined) return;

    const game = GameService.getInstance().getGameById(gameId);
    if (game === undefined || game.state !== GameStates.PLAYING) return;

    const currentPlayer = game.room.players.find((p) => p.id === id) as Player;
    if (currentPlayer.state === PlayerStates.Dead || currentPlayer.visibility === false) return;

    const { x, y } = this.calculateNewPosition(
      currentPlayer,
      currentPlayer.direction
    );

    const isOccupied = this.isOccupied(x, y, game.room.players);
    if (isOccupied === undefined) return;

    isOccupied.state = PlayerStates.Dead;

    ServerService.getInstance().sendMessageToRoom(
      game.room.name,
      Messages.DIE_PLAYER,
      {
        id: isOccupied.id,
        idKiller: currentPlayer.id
      }
    );

    const alivePlayers = GameService.getInstance().getAlivePlayers(game);
    if (alivePlayers.length === 1) {
      ServerService.getInstance().sendMessageToPlayer(
        alivePlayers[0].id,
        Messages.WINNER,
        {}
      );

      ServerService.getInstance().sendMessageToRoomExceptPlayer(
        alivePlayers[0].id,
        game.room.name,
        Messages.LOOSER,
        {}
      );
    }
  }

  /* Funciones Auxiliares */
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

  private static isOccupied(
    x: number,
    y: number,
    players: Player[]
  ): Player | undefined {
    return players.find((p) => p.x === x && p.y === y);
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

  private static changeDirection(direction: Directions) {
    const directionMap = {
      [Directions.Up as Directions]: Directions.Left,
      [Directions.Left as Directions]: Directions.Down,
      [Directions.Down as Directions]: Directions.Right,
      [Directions.Right as Directions]: Directions.Up,
    };

    return directionMap[direction];
  }
}
