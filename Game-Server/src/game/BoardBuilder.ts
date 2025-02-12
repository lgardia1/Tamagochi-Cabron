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

    const map: Array<number[]> = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 5, 0, 0, 0],
      [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 5, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
      [0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    for (let i = 0; i < this.board.dimensions.height; i++)
      for (let j = 0; j < this.board.dimensions.width; j++)
        if (map[i][j] != 0) {
          this.board.bushes.push({ x: j, y: i });
        }
  }

  public getBoard(): Board {
    return this.board;
  }
}
