export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, spriteKey, frame, scale, onClickCallback) {
      super(scene, x, y, spriteKey, frame);  
      scene.add.existing(this);              
      this.setOrigin(0, 0);                   
      this.setScale(scale);                  
      this.setInteractive();  
      this.setFrame(frame);                
  
      
      this.on('pointerdown', onClickCallback); 
  
      
      this.on('pointerover', () => {
        this.setTint(0x44ff44); 
      });
  
      this.on('pointerout', () => {
        this.clearTint(); 
      });
    }
  
  }
  