import Player from "../sprites/Player.js";
import Bullet from "../sprites/Bullet.js";
import Button from "../sprites/Button.js";
import Bush from "../sprites/Bush.js";
import Color from "../util/Color.js";
import Config from "../config/config.js";
import ConnectionHandler from "../service/ConnectionHandler.js";
import UI from "../ui/UI.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.baseURL = "./assets/img/";

    for (let i = 1; i <= 6; i++) {
      this.load.image(`SD-sprite${i}`, `SD-${i}.png`);
    }

    for (let i = 1; i <= 4; i++) {
      this.load.image(`bush${i}`, `bush-sprite${i}.png`);
    }

    this.load.spritesheet("bullets", "bullets.png", {
      frameWidth: 24,
      frameHeight: 24,
    });

    this.load.spritesheet("buttonsSprite", "button-assets.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    for (let i = 1; i <= 100; i++) {
      this.load.image(`winner-${i}`, `winner/winner-${i}.gif`);
    }

    this.load.image(`calvo`, "looser/calvo.png");

    this.load.audio("move", "../audio/move.mp3");
    this.load.audio("shoot", "../audio/shoot.mp3");
  }

  create() {
    this.currentPlayer = null;
    this.players = [];
    this.bushes = [];
    this.buttons = [];
    this.bullets = [];

    UI.toogleSpinner();
    this.setUpConnectionHandler();
  }

  setUpConnectionHandler() {
    ConnectionHandler.init(
      "https://localhost:3000",
      () => {
        console.log("Se ha podido conectarse al servidor");
        ConnectionHandler.gameService.scene = this;
      },
      () => {
        console.log("Se ha desconectado del servidor");
      }
    );
  }

  setBoard({ dimensions, bushes }) {
    const { cellSize } = Config;
    const { width, height } = dimensions;

    this.add
      .grid(
        0,
        0,
        width * cellSize,
        height * cellSize,
        cellSize,
        cellSize,
        Color.rgb(199, 196, 196),
        1,
        Color.rgb(255, 0, 0),
        0
      )
      .setOrigin(0, 0);

    bushes.forEach(({ x, y }, index) => {
      const bush = new Bush(
        this,
        x * cellSize + cellSize / 10 - 2,
        y * cellSize + cellSize / 2 - 2,
        `bush${Math.floor(Math.random() * 4) + 1}`,
        0,
        Config.scale.BUSH
      );

      this.add
        .rectangle(
          x * cellSize,
          y * cellSize,
          cellSize - 1,
          cellSize - 1,
          0x3f7f4f
        )
        .setOrigin(0, 0)
        .setDepth(2);

      bush.setDepth(3);

      this.bushes.push(bush);
    });
  }

  setUpCameraPrevisualization(dimensions) {
    const { cellSize, height: viewPortHeight, width: viewPortWidth } = Config;
    const { width, height } = dimensions;
    const boardWidth = width * cellSize;
    const boardHeight = height * cellSize;

    const zoomX = this.cameras.main.width / boardWidth;
    const zoomY = this.cameras.main.height / boardHeight;
    const zoom = Math.min(zoomX, zoomY);

    this.cameras.main.setBounds(0, 0, boardWidth, boardHeight);
    if (width < height) {
      this.cameras.main.setPosition(
        (viewPortWidth - cellSize * height) * -1,
        0
      );
    } else {
      this.cameras.main.setPosition(
        0,
        (viewPortHeight - cellSize * width) * -0.5
      );
    }

    this.cameras.main.setZoom(zoom);
  }

  setCurrentPlayer(player, gameId) {
    const currentPlayer = this.buildPlayer(player);
    this.setAnimation(currentPlayer);
    currentPlayer.gameId = gameId;
    this.currentPlayer = currentPlayer;
    this.players.push(currentPlayer);
  }

  addPlayer(...players) {
    players.forEach((player) => {
      const p = this.buildPlayer(player);
      this.setAnimation(p);
      this.players.push(p);
    });
  }

  buildPlayer({ x, y, state, direction, visibility, id }) {
    const cellSize = Config.cellSize;
    return new Player(
      this,
      x * cellSize + cellSize / 2,
      y * cellSize + cellSize / 2,
      "SD-sprite1",
      Config.scale.PLAYER,
      state,
      direction,
      visibility,
      id
    ).setDepth(4);
  }

  removePlayer({ id }) {
    const playerFound = this.players.findIndex((player) => player.id === id);
    this.players[playerFound].destroy();
    this.players.splice(playerFound, 1);
  }

  setupButtons(gameService) {
    const { cellSize, height, scale } = Config;
    console.log(gameService);

    this.buttons.push(
      new Button(
        this,
        cellSize / 2,
        height - cellSize / 2 - 50,
        "buttonsSprite",
        16,
        scale.BUTTON,
        () => gameService.move()
      )
    );

    this.buttons.push(
      new Button(
        this,
        cellSize / 2 + 100,
        height - cellSize / 2 - 50,
        "buttonsSprite",
        49,
        scale.BUTTON,
        () => gameService.rotate()
      )
    );

    const shootButton = new Button(
      this,
      cellSize / 2 + 200,
      height - cellSize / 2 - 50,
      "buttonsSprite",
      1,
      scale.BUTTON,
      () => gameService.shoot()
    );

    this.buttons.push(shootButton);
    this.shootButton = shootButton;
  }

  setButtonsIntercative() {
    this.buttons.forEach((button) => {
      button.setInteractive();
    });
  }

  setButtonsdisableInteractive() {
    this.buttons.forEach((button) => {
      button.disableInteractive();
    });
  }

  setAnimation(player) {
    player.anims.play("animate-player");
  }

  createAnimations() {
    this.anims.create({
      key: "animate-player",
      frames: [
        { key: "SD-sprite1" },
        { key: "SD-sprite2" },
        { key: "SD-sprite3" },
        { key: "SD-sprite4" },
        { key: "SD-sprite5" },
        { key: "SD-sprite6" },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "animate-bullets",
      frames: this.anims.generateFrameNumbers("bullets", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "animate-winner",
      frames: Array.from({ length: 100 }, (_, index) => ({
        key: `winner-${index + 1}`,
      })),
      frameRate: 10,
      repeat: -1,
    });
  }

  setUpCamera() {
    this.cameras.main.setBounds(
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
      Number.MAX_VALUE * 2,
      Number.MAX_VALUE * 2
    );
    this.cameras.main.setPosition(0, 0);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.currentPlayer);
  }

  resetGame() {
    this.scene.restart();
  }

  rotatePlayer({ id, direction }) {
    this.players.forEach((player) => {
      if (player.id === id) {
        console.log("Esta es la direccion: ");
        player.setDirection(direction);
        return;
      }
    });
  }

  movePlayer({ id, x, y, visibility }) {
    this.players.forEach((player) => {
      if (player.id === id) {
        player.setPositionMove(x, y);
        if (this.currentPlayer.id !== id) {
          player.setVisible(visibility);
          return;
        }
        if (visibility) {
          this.shootButton.setInteractive();
          return;
        }
        this.shootButton.disableInteractive();
        return;
      }
    });
  }

  shootPlayer() {
    this.sound.play("shoot");
    const bullet = new Bullet(
      this,
      this.currentPlayer.x,
      this.currentPlayer.y,
      "bullets",
      1.5,
      this.currentPlayer.direction,
      430
    ).anims
      .play("animate-bullets")
      .setDepth(5);
    
    setTimeout(()=>{
      bullet.destroy();
    }, 200)
  }

  diePlayer({ id, idKiller }) {
    const playerDead = this.players.find((player) => player.id === id);
    if (!playerDead) return;

    playerDead.die();

    if (id === this.currentPlayer.id) {
      this.setButtonsdisableInteractive();
      this.showResultText("Has Perdido", -250);

      setTimeout(() => {
        this.showPressEnter(100);
        this.setInputResetGame();
      }, 2000);

      const killer = this.players.find((player) => player.id === idKiller);
      if (killer) {
        this.cameras.main.startFollow(killer);
      }
    }
  }

  diePlayerTorment({ id }) {
    const playerDead = this.players.find((player) => player.id === id);
    if (!playerDead) return;

    playerDead.die();

    if (id === this.currentPlayer.id) {
      this.setButtonsdisableInteractive();
      this.showResultText("Has Perdido", -250);

      setTimeout(() => {
        this.showPressEnter(100);
        this.setInputResetGame();
      }, 2000);

      this.cameras.main.startFollow(
        this.players[Math.floor(Math.random() * this.players.length)]
      );
    }
  }

  createStormEffect(stormSize, dimensions) {
    const { cellSize } = Config;
    const { width, height } = Config.dimensions;

    const graphics = this.add.graphics();
    graphics.clear();
    graphics.fillStyle(0x40025e, 0.5);

    for (let y = 1 + stormSize; y < height - 1 - stormSize; y++) {
      graphics
        .fillRect(cellSize * stormSize, y * cellSize, cellSize, cellSize)
        .setDepth(4);
      graphics
        .fillRect(
          cellSize * (width - 1 - stormSize),
          y * cellSize,
          cellSize,
          cellSize
        )
        .setDepth(4);
    }

    for (let x = stormSize; x < width - stormSize; x++) {
      graphics
        .fillRect(x * cellSize, cellSize * stormSize, cellSize, cellSize)
        .setDepth(4);
      graphics
        .fillRect(
          x * cellSize,
          cellSize * (height - 1 - stormSize),
          cellSize,
          cellSize
        )
        .setDepth(4);
    }
  }

  showResultText(message, offsetY) {
    const resultText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + offsetY,
        message,
        {
          fontSize: "48px",
          fill: "#ffffff",
          fontFamily: "Montserrat",
          backgroundColor: "#000000",
        }
      )
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDepth(99);

    this.tweens.add({
      targets: resultText,
      duration: 1000,
      y: resultText.y + 20,
      yoyo: true,
      repeat: -1,
      ease: "Linear",
    });
  }

  showPressEnter(offsetY) {
    const press = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + offsetY,
        "Presiona Enter para jugar",
        {
          fontFamly: "Montserrat",
          fontSize: "40px",
          fill: "#000",
        }
      )
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDepth(100);

    this.tweens.add({
      targets: press,
      alpha: { from: 1, to: 0.3 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Linear",
    });
  }

  setInputResetGame() {
    this.input.on("pointerdown", () => {
      if (this.calvo) this.calvo.destroy();
      this.scene.restart();
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.calvo) this.calvo.destroy();
      this.scene.restart();
    });
  }

  winner() {
    this.showResultText("HAS GANADO!!!", -100);
    this.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "winner")
      .setScrollFactor(0)
      .setOrigin(0.5)
      .setDepth(95)
      .setScale(1.9)
      .play("animate-winner");

    setTimeout(() => {
      this.buttons.forEach((button) => {
        button.destroy();
      });
      this.showPressEnter(100);
      this.setInputResetGame();
      this.setUpCameraPrevisualization(Config.dimensions);
      this.cameras.main.stopFollow();
    }, 4000);
  }

  looser() {
    setTimeout(() => {
      this.buttons.forEach((button) => {
        button.destroy();
      });
      this.calvo = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY - 50,
          "calvo"
        )
        .setScrollFactor(0)
        .setOrigin(0.5)
        .setDepth(95)
        .setScale(0.5);
      this.setUpCameraPrevisualization(Config.dimensions);
      this.cameras.main.stopFollow();
    }, 4000);
  }

  update() {
 
  }  
}
