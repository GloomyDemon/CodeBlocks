import type { IBlock } from "./IBlock.js";
import type { IExecutable } from "./IExecutable.js";

export interface IContainer extends IBlock {
    blocks: readonly IExecutable[];
    blocksById: ReadonlyMap<string, IExecutable>;
    addBlock(block: IExecutable, index: number): void;
    deleteBlock(index: number): IExecutable | undefined;
    deleteBlock(id: string): IExecutable | undefined;
}
