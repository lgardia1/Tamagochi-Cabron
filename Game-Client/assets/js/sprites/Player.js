import { Direction } from '../util/GameConstants.js';
import Config from "../config/config.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey, scale, state, direction, visibility, id) {
      super(scene, x, y, spriteKey);
      scene.add.existing(this);
      this.setScale(scale);
      this.setRotation(Direction[direction]);
   

      this.id = id;
      this.direction = direction;
      this.visibility = visibility;
      this.state = state;
    }
  
    getRandomDirection() {
      const directions = [2 * Math.PI, (3 * Math.PI) / 2, Math.PI, Math.PI / 2, 0];
      return directions[Math.floor(Math.random() * directions.length)];
    }
    

    setDirection(direction) {
      this.setRotation(Direction[direction]);
    }

    setPositionMove(x , y) {
      const { cellSize } = Config;
      this.setPosition(x * cellSize + cellSize / 2,  y * cellSize + cellSize / 2);
    }
  }
  