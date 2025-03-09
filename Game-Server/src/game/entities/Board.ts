import { Player } from "../../player/entities/Player";
import { parseArrayEnv } from "../../util/util";
import dotenv from 'dotenv';
dotenv.config();
export interface Bush {
    x : number;
    y : number; 
}

export const BoardConf = {
    get WIDTH() { return parseArrayEnv(process.env.BOARD_DIMENSIONS_WIDTH, 10) as number; },
    get HEIGHT() { return parseArrayEnv(process.env.BOARD_DIMENSIONS_HEIGHT, 10) as number; },
    get NUM_BUSH() { return parseArrayEnv(process.env.NUM_BUSH, 8) as number; }
};


export interface Dimensions {
    height: number;
    width: number;
}

export interface Board {
    dimensions: Dimensions;
    bushes: Array<Bush>;
}