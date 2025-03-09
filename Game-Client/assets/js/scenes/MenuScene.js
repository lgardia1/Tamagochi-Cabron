import Config from "../config/config.js";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    this.load.baseURL = "./assets/img/";
    this.load.image("menuBackground", "menu-background.png");
  }

  create() {
    this.setUpText();
    this.setUpImage();
    this.setUpListener();
  }

  setUpText() {
    this.add.text(80, 100, "Tomogachis Cabrones", {
      fontFamly: "Montserrat",
      fontSize: "50px",
      fontWeight: "bold",
      fill: "#ffff",
    });

    const press = this.add.text(100, 650, "Presiona Enter para jugar", {
      fontFamly: "Montserrat",
      fontSize: "34px",
      fill: "#fff",
    });

    this.tweens.add({
      targets: press,             
      alpha: { from: 1, to: 0.3 },  
      duration: 1000,             
      yoyo: true,                
      repeat: -1,                
      ease: 'Linear'              
  });
  }

  setUpImage() {
    const { width, height } = Config;
    this.add
      .image(width / 2, height / 2 - 200, "menuBackground")
      .setScale(0.45)
      .setOrigin(0.5, 0);
  }

  setUpListener() {
    this.input.on("pointerdown", () => {
      this.scene.start("GameScene"); 
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      this.scene.start("GameScene"); 
    });
  }
}
