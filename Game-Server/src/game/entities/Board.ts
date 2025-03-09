import { Player } from "../../player/entities/Player";
import { parseArrayEnv } from "../../util/util";
import dotenv from 'dotenv';
dotenv.config();
export interface Bush {
    x : number;
    y : number; 
}

export const BoardConf = {
    WIDTH:parseArrayEnv(process.env.BOARD_DIMENSIONS_WIDTH, 10) as number,
    HEIGHT:parseArrayEnv(process.env.BOARD_DIMENSIONS_HEIGHT, 10) as number,
    NUM_BUSH: parseArrayEnv(process.env.NUM_BUSH, 8) as number
}

export interface Dimensions {
    height: number;
    width: number;
}

export interface Board {
    dimensions: Dimensions;
    bushes: Array<Bush>;
}