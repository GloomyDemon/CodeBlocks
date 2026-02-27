import type { IBlock } from "./IBlock.ts";
import type { IExecutable } from "./IExecutable.ts";
export interface IContainer extends IBlock {
    blocks: readonly IExecutable[];
    blocksById: ReadonlyMap<string, IExecutable>;
    addBlock(block: IExecutable, index: number): void;
    deleteBlock(index: number): IExecutable | undefined;
    deleteBlock(id: string): IExecutable | undefined;
}
//# sourceMappingURL=IContainer.d.ts.map