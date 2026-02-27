import type { IExecutable } from "../Interfaces/IExecutable.ts";
import type { IContainer } from "../Interfaces/IContainer.ts";
import type { INamed } from "../Interfaces/INamed.ts";
export declare class VoidFunc implements IExecutable, IContainer, INamed {
    #private;
    get blocksById(): ReadonlyMap<string, IExecutable>;
    get blocks(): readonly IExecutable[];
    constructor(id: string, name: string);
    execute(): void;
    addBlock(block: IExecutable, index?: number): void;
    get id(): string;
    get name(): string;
    deleteBlock(index: number): IExecutable | undefined;
    deleteBlock(id: string): IExecutable | undefined;
}
//# sourceMappingURL=VoidFunc.d.ts.map