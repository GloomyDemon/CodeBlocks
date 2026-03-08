import type { IBlock } from "./IBlock.ts";
import type { IExecutable } from "./IExecutable.ts";

export interface IContainer extends IBlock {

    blocks: readonly IExecutable[];
    blocksById: ReadonlyMap<number, IExecutable>;
    addBlock(block: IExecutable, index: number): void;
    deleteBlock(id: number): IExecutable | undefined;

}
