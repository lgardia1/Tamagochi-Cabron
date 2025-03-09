import { Board, BoardConf } from "./entities/Board";

export class BoardBuilder {
  private board: Board;

  constructor() {
    this.board = {
      dimensions: {
        width: BoardConf.WIDTH,
        height: BoardConf.HEIGHT,
      },
      bushes: []
    };

    this.board.bushes = this.generateBushes(
      this.board.dimensions.width,
      this.board.dimensions.height,
      BoardConf.NUM_BUSH
    );
  }

  private generateBushes(boardWidth: number, boardHeight: number, bushCount: number): { x: number; y: number }[] {
    const bushes: { x: number; y: number }[] = [];
    
   
    let validPositions: { x: number; y: number }[] = [];
    for (let y = 1; y < boardHeight - 1; y++) {
      for (let x = 1; x < boardWidth - 1; x++) {
        validPositions.push({ x, y });
      }
    }

  
    validPositions = validPositions.sort(() => Math.random() - 0.5);

   // Calculo aproximado de numero maximo de arbustos que pueden caber en el tablero
    const maxPossible = Math.floor(validPositions.length / 5);
    bushCount = Math.min(bushCount, maxPossible);

   
    while (bushes.length < bushCount && validPositions.length > 0) {
      const index = Math.floor(Math.random() * validPositions.length);
      const position = validPositions[index];
      
   
      let isValid = true;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (bushes.some(b => 
            b.x === position.x + dx && 
            b.y === position.y + dy
          )) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;
      }

      if (isValid) {
        bushes.push(position);
       
        validPositions = validPositions.filter(p => 
          Math.abs(p.x - position.x) > 1 || 
          Math.abs(p.y - position.y) > 1
        );
      } else {
        validPositions.splice(index, 1);
      }
    }

    return bushes;
  }

  public getBoard(): Board {
    return this.board;
  }
}