import { GameStatus , Direction }  from "../util/GameConstants.js";
import UI from "../ui/UI.js";

export default class GameService {
    #actionsList = {
        "JOIN_GAME" : this.do_joinGame.bind(this),
        "NEW_PLAYER" : this.do_newPlayer.bind(this),
        "CHANGE_DIRECTION" : this.do_direction.bind(this),
        "MOVE_PLAYER" : this.do_move.bind(this),
        "START_GAME" : this.do_gameStart.bind(this),
        "WINNER" : this.do_winner.bind(this),
        "LOOSER": this.do_looser.bind(this),
        "START_COUNT_DOWN": this.do_startCountDown.bind(this),
        "DISCONNECTED_PLAYER" : this.do_disconnectedPlayer.bind(this)
    };

    #state = null;

    constructor(){
        this.#state = GameStatus.WAITING;
    }

    async do (data) {
        this.#actionsList[data.type](data.content)
    }

    do_joinGame({gameId, board, player: currentPlayer, players}) {
        this.scene.createAnimations();
        this.scene.setBoard(board);
        this.scene.setCurrentPlayer(currentPlayer, gameId);
        this.scene.addPlayer(players);
    }

    do_newPlayer (player) {
        this.scene.addPlayer(player);
    }

    do_direction({id , direction}) {

    }

    do_disconnectedPlayer(player) {
        this.scene.removePlayer(player);
    }

    do_startCountDown({time}) {
        UI.toogleSpinner();
        UI.timerStartGame(time, () => {
            this.scene.setUpCamera()
        });
    }

    do_move({id , x , y}) {

    }

    do_gameStart() {
        this.#state = GameStatus.PLAYING;
    }

    do_winner() {

    }

    do_looser() {

    }
}