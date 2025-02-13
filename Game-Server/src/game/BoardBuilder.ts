import { Board } from "./entities/Board";

export class BoardBuilder {
  private board: Board;

  constructor() {
    this.board = {
      dimensions: {
        width: 10,
        height: 10,
      },
      bushes: [],
    };

    this.board.bushes = this.generateBushes(10, 10, 8);
  }

  private generateBushes(boardWidth: number, boardHeight: number, bushCount: number): { x: number; y: number }[] {
    const bushes: { x: number; y: number }[] = [];
    const map: number[][] = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));

    const isValidPosition = (x: number, y: number): boolean => {
      if (x === 0 || y === 0 || x === boardWidth - 1 || y === boardHeight - 1) return false;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (map[y + dy]?.[x + dx] === 5) return false;
        }
      }
      return true;
    };

    while (bushes.length < bushCount) {
      const x = Math.floor(Math.random() * (boardWidth - 2)) + 1;
      const y = Math.floor(Math.random() * (boardHeight - 2)) + 1;

      if (isValidPosition(x, y)) {
        map[y][x] = 5;
        bushes.push({ x, y });
      }
    }
    return bushes;
  }

  public getBoard(): Board {
    return this.board;
  }
}
