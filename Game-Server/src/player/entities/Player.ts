import { Socket } from "socket.io";

export enum Directions {
    Up = "Up", 
    Down = "Down",
    Left = "Left",
    Right = "Right",
}

export enum PlayerStates {
    Live, Dead
}

export interface Player {
    id: string;
    x: number;
    y: number;
    state: PlayerStates;
    direction: Directions;
    visibility: Boolean;
}


export interface PlayerData {
    gameId: string;
    x?: number;
    y?: number;
    direction?: Directions;
    visibility?: boolean;
}