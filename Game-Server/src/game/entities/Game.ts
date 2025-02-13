import { Room } from "../../room/entities/Room";
import { Board } from "./Board";

export enum GameStates {
    WAITING, PLAYING, COUNT_DOWN
}

export enum GameConf {
    COUNT_DOWN = 5,
}

export enum Messages {
    CURRENT_PLAYER = "CURRENT_PLAYER",
    JOIN_GAME = "JOIN_GAME",
    NEW_PLAYER = "NEW_PLAYER",
    MOVE_PLAYER = "MOVE_PLAYER",
    START_COUNT_DOWN = "START_COUNT_DOWN",
    START_GAME = "START_GAME",
    WINNER = "WINNER",
    LOOSER= "LOOSER",
    DISCONNECTED_PLAYER = "DISCONNECTED_PLAYER",
    ROTATE_PLAYER = "ROTATE_PLAYER",
    DIE_PLAYER = "DIE_PLAYER"
}

export interface Game {
    id : String,
    state: GameStates,
    room: Room,
    board: Board
}