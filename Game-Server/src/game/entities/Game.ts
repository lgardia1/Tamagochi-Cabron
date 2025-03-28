import { Room } from "../../room/entities/Room";
import { parseArrayEnv } from "../../util/util";
import { Board } from "./Board";
import dotenv from 'dotenv';
dotenv.config();

export enum GameStates {
    WAITING, PLAYING, COUNT_DOWN, ENDED
}

export const GameConf = {
    get COUNT_DOWN() { return parseArrayEnv(process.env.COUNT_DOWN, 5) as number; },
    get START_TORMENT() { return parseArrayEnv(process.env.START_TORMENT, 10) as number; },
    get SPEED_TORMENT() { return parseArrayEnv(process.env.SPEED_TORMENT, 1) as number; },
    get TORMENT() { return parseArrayEnv(process.env.TORMENT, 'true') as string; },
    get TIME_TO_DIE_TORMENT() { return parseArrayEnv(process.env.TIME_TO_DIE_TORMENT, 2) as number; }
};


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
    DIE_PLAYER = "DIE_PLAYER",
    EXPAND_TORMENT = "EXPAND_TORMENT",
    DIE_PLAYER_TORMENT = "DIE_PLAYER_TORMENT"
}

export interface Game {
    id : String,
    state: GameStates,
    room: Room,
    board: Board,
    stormSize: number
}