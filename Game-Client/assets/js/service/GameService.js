import { GameStatus, Direction, Message } from "../util/GameConstants.js";
import Config  from '../config/config.js'
import UI from "../ui/UI.js";

export default class GameService {
  #actionsList = {
    JOIN_GAME: this.do_joinGame.bind(this),
    NEW_PLAYER: this.do_newPlayer.bind(this),
    ROTATE_PLAYER: this.do_rotatePlayer.bind(this),
    MOVE_PLAYER: this.do_movePlayer.bind(this),
    START_GAME: this.do_gameStart.bind(this),
    WINNER: this.do_winner.bind(this),
    LOOSER: this.do_looser.bind(this),
    START_COUNT_DOWN: this.do_startCountDown.bind(this),
    DISCONNECTED_PLAYER: this.do_disconnectedPlayer.bind(this),
    DIE_PLAYER: this.do_diePLayer.bind(this),
    EXPAND_TORMENT: this.do_expandTormnet.bind(this),
    DIE_PLAYER_TORMENT: this.do_diePLayerTorment.bind(this),
  };

  #state = null;
  #timerId = null;
  #socket = null;

  constructor(socket) {
    this.#socket = socket;
    this.#state = GameStatus.WAITING;
    this.#timerId = null;
  }

  async do(data) {
    this.#actionsList[data.type](data.content);
  }

  do_joinGame({ gameId, board, player: currentPlayer, players }) {
    // Screen
    this.scene.setBoard(board);
    Config.dimensions = board.dimensions;

    // Player
    this.scene.createAnimations();
    this.scene.setCurrentPlayer(currentPlayer, gameId);
    this.scene.addPlayer(...players);

    // Camera
    this.scene.setUpCameraPrevisualization(board.dimensions);
  }

  do_newPlayer(player) {
    this.scene.addPlayer(player);
  }

  do_disconnectedPlayer(player) {
    this.scene.removePlayer(player);

    if (this.#state !== GameStatus.COUNTDOWN) {
      return;
    }

    this.#state = GameStatus.WAITING;
    UI.toogleSpinner();

    if (this.#timerId !== null) {
      clearTimeout(this.#timerId.timerTimeout);
      clearInterval(this.#timerId.timerInterval);

      const timerElement = document.getElementById("timer");
      if (timerElement) {
        timerElement.textContent = "0";
        timerElement.style.display = "none";
      }
    }
  }

  do_startCountDown({ time }) {
    UI.toogleSpinner();

    this.#state = GameStatus.COUNTDOWN;
    this.#timerId = UI.timerStartGame(time, () => {});
  }

  do_gameStart() {
    this.#state = GameStatus.PLAYING;
    this.scene.setUpCamera();
    this.scene.setupButtons(this);
    this.scene.setButtonsIntercative();
  }

  do_expandTormnet({ stormSize }){
    this.scene.createStormEffect(stormSize);
  }

  do_winner() {
    this.scene.setButtonsdisableInteractive();
    this.scene.winner();
  }

  do_looser() {
    this.scene.looser();
  }

  move() { 
    this.scene.sound.play('move');
    const { gameId } = this.scene.currentPlayer;
    this.#socket.emit("message", {
      type: Message.MOVE_PLAYER,
      content: { gameId },
    });
  }

  rotate() {
    const { gameId } = this.scene.currentPlayer;
    this.#socket.emit("message", {
      type: Message.ROTATE_PLAYER,
      content: { gameId },
    });
  }

  shoot() {
    this.scene.shootPlayer();
    const { gameId } = this.scene.currentPlayer;
    this.#socket.emit("message", {
      type: Message.SHOOT_PLAYER,
      content: { gameId },
    });
  }

  do_rotatePlayer(player) {
    this.scene.rotatePlayer(player);
  }

  do_movePlayer(player) {
    this.scene.movePlayer(player);
  }

  do_diePLayer(player) {
    this.scene.diePlayer(player);
  }

  do_diePLayerTorment(player) {
    this.scene.diePlayerTorment(player);
  }
}
