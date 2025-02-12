import GameScene from "./scenes/GameScene.js";
/* import MenuScene from "./scenes/MenuScene.js"; */
import Config from "./config/config.js";
import Color from "./util/Color.js";
document.addEventListener('DOMContentLoaded', ()=>{
  const config = {
    type: Phaser.AUTO,
    width: Config.width,
    height: Config.height,
    parent: "app",
    scale: {
      mode: Phaser.Scale.FIT, // Ajusta el juego para que quepa en la pantalla
    },
    backgroundColor: Color.rgb(48, 48, 59),
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
      },
    },
    scene: GameScene,
  };
  
  var game = new Phaser.Game(config);
})

