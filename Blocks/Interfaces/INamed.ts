import type { IBlock } from "./IBlock.ts";

export interface INamed extends IBlock {
    readonly name : string;
}
