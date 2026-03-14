import type { IBlock } from "./IBlock.js";

export interface INamed extends IBlock {
    readonly name : string;
}
