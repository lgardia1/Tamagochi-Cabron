import { Player } from "../../player/entities/Player";
export interface Bush {
    x : number;
    y : number; 
}

export interface Dimensions {
    height: number;
    width: number;
}

export interface Board {
    dimensions: Dimensions;
    bushes: Array<Bush>;
}