import { Socket } from "socket.io";
import { Game } from "../../game/entities/Game";

export enum Directions {
    Up = "Up", 
    Down = "Down",
    Left = "Left",
    Right = "Right",
}

export enum PlayerStates {
    Live, Dead, IntoTorment 
}

export interface Player {
    id: string;
    x: number;
    y: number;
    state: PlayerStates;
    direction: Directions;
    visibility: Boolean;
    tormentTimeOut: NodeJS.Timeout | null;
}


export interface PlayerData {
    gameId: string;
    x?: number;
    y?: number;
    direction?: Directions;
    visibility?: boolean;
}

export interface PlayerGameInfo {
    currentPlayer: Player;
    game: Game;
}