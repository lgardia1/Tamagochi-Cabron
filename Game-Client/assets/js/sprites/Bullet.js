import { Direction } from "../util/GameConstants.js";
import Config from "../config/config.js";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, scale, direction, velocity) {
    super(scene, x, y, spriteKey);
    scene.add.existing(this);
    scene.physics.add.existing(this); 
    this.setScale(scale);
    this.setDirection(direction);
    this.setDepth(10);
    this.body.setCollideWorldBounds(false);
    this.origin = x;
    this.origin = y;

    if (direction === "Right") {
      this.setVelocityX(velocity);
    } else if (direction === "Left") {
      this.setVelocityX(-velocity);
    } else if (direction === "Up") {
      this.setVelocityY(velocity);
    } else if (direction === "Down") {
      this.setVelocityY(-velocity);
    }
  
  }

  setDirection(direction) {
    this.setRotation(Direction[direction] + Math.PI);
  }

  // Método para posicionar la bala correctamente en la cuadrícula
  setPositionMove(x, y) {
    const { cellSize } = Config;
    this.setPosition(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
  }
}
