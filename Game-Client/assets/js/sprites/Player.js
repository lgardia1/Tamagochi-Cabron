import { Direction } from '../util/GameConstants.js';

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
  
    move() {
      const moveDirection = this.getMoveDirection();
      const cellSize = this.scene.game.config.width / 10;
      
      if (this.isValidMove(moveDirection)) {
        this.setPosition(
          this.x + moveDirection.x * cellSize,
          this.y + moveDirection.y * cellSize
        );
      }
    }
  
    rotate() {
      this.setRotation(this.rotation + Math.PI / 2);
    }
  
    getMoveDirection() {
      const rotation = this.rotation;
      const moveDirection = { x: 0, y: 0 };
  
      if (Math.abs(rotation) % Math.PI !== 0) {
        moveDirection.y = rotation > 0 ? -1 : 1;
      } else {
        moveDirection.x = rotation >= 0 ? -1 : 1;
      }
  
      return moveDirection;
    }
  
    isValidMove(moveDirection) {
      const {width , height} = this.scene.game.config;
      const cellSize = width / 10;

      const newX = this.x + moveDirection.x * cellSize;
      const newY = this.y + moveDirection.y * cellSize;
  
      return newX >= 0 && newX <= width && newY >= 0 && newY <= height - 100;
    }

  }
  