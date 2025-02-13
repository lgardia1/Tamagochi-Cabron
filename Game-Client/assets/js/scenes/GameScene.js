import Player from "../sprites/Player.js";
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

    this.load.spritesheet("buttonsSprite", "button-assets.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    this.currentPlayer = null;
    this.players = [];
    this.bushes = [];
    this.buttons = [];

    UI.toogleSpinner();
    this.setUpConnectionHandler();
  }

  setUpConnectionHandler() {
    ConnectionHandler.init(
      "http://localhost:3000",
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
  }

  setButtonsIntercative() {
    this.buttons.forEach((button) => {
      button.setInteractive();
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
  }

  setUpCamera() {
    this.cameras.main.scrollX = this.width / 2;
    this.cameras.main.scrollY = this.width / 2;
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

  movePlayer({ id, x, y }) {
    this.players.forEach((player) => {
      if (player.id === id) {
        console.log("Esta es la direccion: ");
        player.setPositionMove(x , y);
        return;
      }
    });
  }

  update() {}
}
