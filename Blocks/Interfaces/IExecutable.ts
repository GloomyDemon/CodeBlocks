import type { IBlock } from "./IBlock.js";

export interface IExecutable extends IBlock {
    execute(): void;
}
