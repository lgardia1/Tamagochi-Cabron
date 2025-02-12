export default class Bush extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, spriteKey, frame, scale) {
    super(scene, x, y, spriteKey, frame);
    scene.add.existing(this);
    this.setOrigin(0, 0);
    this.setScale(scale);
    this.setFrame(frame);
  }
}
