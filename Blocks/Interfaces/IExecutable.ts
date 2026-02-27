import type { IBlock } from "./IBlock.ts";

export interface IExecutable extends IBlock {
    execute(): void;
}
